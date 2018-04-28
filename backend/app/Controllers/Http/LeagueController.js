'use strict';
const League = use('App/Models/League');

class LeagueController {
  getLeagues({request, auth}) {
    let query = request.get();
    let limit = query['limit'] !== undefined ? query['limit'] : 25;
    let page = query['page'] !== undefined ? query['page'] : 1;
    return League
      .query()
      .select('league.*')
      .with('teams')
      .with('teams.user')
      .innerJoin('team', 'team.league_id', 'league.id')
      .innerJoin('users', 'users.id', 'team.user_id')
      .where('users.id', '=', auth.user.id)
      .paginate(page, limit);
  }

  getLeague({params}) {
    return League
      .query()
      .with('teams')
      .where('id', '=', params.id)
      .first()
      ;
  }
}

module.exports = LeagueController;
