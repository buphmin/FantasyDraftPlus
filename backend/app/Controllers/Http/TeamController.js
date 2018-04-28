'use strict'

const Team = use('App/Models/Team');


class TeamController {
  getTeam({params}) {
    return Team
      .query()
      .where('id', '=', params.id)
      .first();
  }
}

module.exports = TeamController;
