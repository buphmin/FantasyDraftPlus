'use strict'
// const Promise = require('bluebird');
const LeaguePlayer = use('App/Models/LeaguePlayer');
const Team = use('App/Models/Team');
const LeaguePositionLimit = use('App/Models/LeaguePositionLimit');
const League = use('App/Models/League');
// const User = use ('App/Models/User');
const DraftOrder = use('App/Models/DraftOrder');
const Database = use('Database');

let orderToColumnName = {
  'playerName': 'player.name',
  'teamName': 'team.name',
  'nflTeam': 'nfl_team',
  'position': 'player_player_position.player_position_id'
};

let debug = true;

class LeaguePlayerController {

  getLeaguePlayers({request, params, auth}) {
    let queryParams = request.get();

    // console.log(Promise);
    let limit = queryParams['limit'] !== undefined ? queryParams['limit'] : 25;
    let page = queryParams['page'] !== undefined ? queryParams['page'] : 1;
    let team = queryParams['team'];
    let orderColumn = queryParams['order'];
    let direction = queryParams['descending'] === 'true' ? 'desc' : 'asc';
    let builder;

    if(queryParams.name !== undefined && queryParams.name !== null && queryParams.name !== '') {
      builder = LeaguePlayer
        .query()
        .with('player')
        .with('team')
        .with('player.positions')
        .whereHas('player', (builder) => {
          builder.whereRaw(`
          (player.name like ?)
          `, `%${queryParams.name}%`);
        })
        ;

    } else {
      builder = LeaguePlayer
        .query()
        .with('player')
        .with('team')
        .with('player.positions')
        ;
    }

    builder
      .select('league_player.*')
      .innerJoin('player', 'player.id', 'league_player.player_id')
      .innerJoin('player_player_position', 'player.id', 'player_player_position.player_id')
      .leftJoin('team', 'team.id', 'league_player.team_id')
    ;

    if(orderColumn !== 'null' && orderColumn !== undefined) {
      builder
        .orderByRaw(`${orderToColumnName[orderColumn]} ${direction}`)
    }


    if(team !== undefined) {
      builder.where('league_player.team_id', '=', team);
    }

    return builder
      .where('league_player.league_id', '=', params.league)
      .paginate(page, limit);
  }



  async updateLeaguePlayer({request, params, auth, response}) {
    //check if dropping.
    //If Y. check if not on your team
    //check draft live.
    //if live. Check if on not your team
    //if live. Check if on clock.
    //if live. Check position limit.
    //update
    let queryParams = request.get();

    let leaguePlayerId = params.id;
    let userId = auth.user.id;
    let team = queryParams['team'];

    if(team !== undefined) {
      team = parseInt(team);
      let league = await League
        .query()
        .where('id', '=', params.league)
        .first();

      if(league.draft_live === 1) {
        let isUserOnClock = await this.checkOnClock(team, userId);

        if(isUserOnClock !== false) {
          return this.handleAddPlayerNormal(leaguePlayerId, userId, team, response, league.draft_live === 1, isUserOnClock);
        } else {
          response.status(400);
          return {
            error: 'You are not on the clock'
          }
        }
      } else {
        return this.handleAddPlayerNormal(leaguePlayerId, userId, team, response);
      }
    } else {
      return this.handleDropLeaguePlayer(leaguePlayerId, userId, response);
    }
  }

  async handleAddPlayerNormal(leaguePlayerId, userId, newTeamId, response, draftLive = false, draftOrder = null) {
    let currentLeaguePlayer = await LeaguePlayer
      .query()
      .with('player')
      .with('team')
      .with('league')
      .with('player.positions')
      .where('league_player.id', '=', leaguePlayerId)
      .first();

    let jsonLeaguePlayer = currentLeaguePlayer.toJSON();
    let isWithinPositionLimit = await this.isWithinPositionLimits(jsonLeaguePlayer, newTeamId);

    if(isWithinPositionLimit !== true) {
      response.status(400);
      return {
        error: `You have too many ${isWithinPositionLimit}'s on your team`
      }
    } else {
      currentLeaguePlayer.team_id = newTeamId;

      if(draftLive) {
        const transaction = await Database.beginTransaction();

        try {
          await currentLeaguePlayer.save(transaction);

          draftOrder.team_id = newTeamId;
          draftOrder.player_selected_id = currentLeaguePlayer.id;
          draftOrder.end_time = new Date();
          await draftOrder.save(transaction);

          let nextOrder = await DraftOrder
            .query()
            .whereRaw('end_time is null')
            .whereRaw('player_selected_id is null')
            .orderBy('pick_number', 'asc')
            .first();

          if(nextOrder) {
            let startTime = new Date();
            let endTime = new Date();
            endTime.setDate(startTime.getDate() + 1);
            nextOrder.start_time = startTime;
            nextOrder.end_time = endTime;
            await nextOrder.save(transaction);
          }

          transaction.commit()
        } catch(e) {
          transaction.rollback();
          throw e;
        }


      } else {
        await currentLeaguePlayer.save();
      }

      return;
    }
  }

  async checkOnClock(teamId, userId) {
    let rows = await Team
      .query()
      .where('id', '=', teamId)
      .where('user_id', '=', userId)
      .fetch();

    //if you dont own this team.
    if(rows.length === 0) {
      return false;
    } else {
      let order = await DraftOrder
        .query()
        .where('end_time', '>=', new Date())
        .whereRaw('player_selected_id is null')
        .orderBy('pick_number', 'asc')
        .first();

      return order;
    }
  }

  async isWithinPositionLimits(jsonLeaguePlayer, teamId) {
    let positionGroups = jsonLeaguePlayer.player.positions.map(e => e.position_group);

    let queryResponse = await LeaguePositionLimit
      .query()
      .where('league_id', '=', jsonLeaguePlayer.league.id)
      .fetch();


    // language=MySQL
    let sql = `
      select
       pp.position_group,
        count(pp.position_group) as position_count
      from league_player lp
        JOIN player p ON lp.player_id = p.id
        JOIN player_player_position position ON p.id = position.player_id
        JOIN player_position pp ON position.player_position_id = pp.id
        JOIN team t ON lp.team_id = t.id
        JOIN league l ON lp.league_id = l.id
        LEFT JOIN league_position_limit l3 ON l.id = l3.league_id
      WHERE t.id = ?
      GROUP BY pp.position_group;
    `;

    let [rows, fields] = await Database
      .raw(sql, [teamId]);

    //map array to a dictionary for easy access
    let teamCounts = rows.reduce((obj, item) => (obj[item.position_group] = item.position_count, obj) ,{});

    let positionRows = queryResponse.rows;
    //map array to a dictionary for easy access
    let positionLimits = positionRows.reduce((obj, item) => (obj[item.position_group] = item.position_limit, obj) ,{});

    for(let positionGroup of positionGroups) {
      //if we are already at the limit, or above, then disallow
      if(teamCounts[positionGroup] >= positionLimits[positionGroup]) {
        return positionGroup;
      }
    }

    return true;

    // console.log('currentLeaguePlayer', jsonLeaguePlayer.player.positions.map(e => e.position_group));
  }

  async handleDropLeaguePlayer(leaguePlayerId, userId, response) {
    let currentLeaguePlayer = await LeaguePlayer
      .query()
      .with('team')
      .where('league_player.id', '=', leaguePlayerId)
      .first();

    if(currentLeaguePlayer.team === null) {
      //not on a team, do nothing.
      return currentLeaguePlayer;
    } else {
      let userTeam = await Team
        .query()
        .where('id', '=', currentLeaguePlayer.team_id)
        .where('user_id', '=', userId)
        .fetch();

      if(userTeam.rows.length === 0) {
        response.status(400);
        return {
          error: 'Cannot drop a player from another team'
        }
      } else {
        currentLeaguePlayer.team_id = null;
        await currentLeaguePlayer.save();
        return;
      }
    }
  }


}

module.exports = LeaguePlayerController;
