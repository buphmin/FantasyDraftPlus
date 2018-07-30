'use strict'

const Team = use('App/Models/Team');


class TeamController {
  getTeam({params}) {
    return Team
      .query()
      .where('id', '=', params.id)
      .first();
  }

  getTeams() {
    return Team
      .query();
  }
}

module.exports = TeamController;
