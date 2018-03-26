'use strict'

const Model = use('Model')

class LeaguePlayer extends Model {
  static get table() {
    return 'league_player';
  }

  player() {
    return this.belongsTo('App/Models/Player');
  }

  team() {
    return this.belongsTo('App/Models/Team');
  }

  league() {
    return this.belongsTo('App/Models/League');
  }
}

module.exports = LeaguePlayer;
