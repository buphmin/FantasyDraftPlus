'use strict'

const Model = use('Model')

class LeaguePositionLimit extends Model {
  static get table() {
    return 'league_position_limit';
  }
}

module.exports = LeaguePositionLimit
