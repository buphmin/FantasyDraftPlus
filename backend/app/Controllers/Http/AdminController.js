'use strict'
const LeaguePlayer = use('App/Models/LeaguePlayer');
const DraftOrder = use('App/Models/DraftOrder');

const Helpers = require('../../Services/Helpers');

class AdminController {
  sendNextOnClockEmail({params, auth, request}) {
    if(auth.user.email.includes('buphmin@gmail.com', 'popeseveni@gmail.com')) {
      Helpers.sendNextUpEmail(params.leagueId);
    } else {
      request.status(401);
      return "You are not authorized to access this action";
    }
  }

  /**
   *
   * @param params
   * @param request
   * @returns {string}
   */
  async addPlayerToTeam({params, request}) {
    if(auth.user.email.includes('buphmin@gmail.com', 'popeseveni@gmail.com')) {
      let queryParams = request.get();

      let league = params.league;
      let team = queryParams.team;
      let pickNumber = queryParams.pickNumber;
      let leaguePlayerId = params.leaguePlayer;


      let currentLeaguePlayer = await LeaguePlayer
        .query()
        .with('player')
        .with('team')
        .with('league')
        .with('player.positions')
        .where('league_player.id', '=', leaguePlayerId)
        .first();

      currentLeaguePlayer.team_id = team;

      await currentLeaguePlayer.save();

      let draftOrder = await DraftOrder
        .query()
        .where('draft_order.pick_number', '=', pickNumber)
        .andWhere('draft_order.league_id', '=', league)
        .first();

      draftOrder.team_id = team;
      draftOrder.player_selected_id = leaguePlayerId;
      draftOrder.end_time = new Date();

      await draftOrder.save();
      return `League player ${leaguePlayerId} updated`;
    } else {
      request.status(401);
      return "You are not authorized to access this action";
    }
  }
}

module.exports = AdminController;
