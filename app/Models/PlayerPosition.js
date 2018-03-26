'use strict'

const Model = use('Model')

class PlayerPosition extends Model {

  static get table() {
    return 'player_position';
  }
}

module.exports = PlayerPosition
