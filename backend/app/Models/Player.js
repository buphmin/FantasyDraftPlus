'use strict';

const Model = use('Model');

class Player extends Model {
  static get table() {
    return 'player';
  }

  positions() {
    return this
      .belongsToMany('App/Models/PlayerPosition')
      .pivotTable('player_player_position')
  }
}

module.exports = Player;
