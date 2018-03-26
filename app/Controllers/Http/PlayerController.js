'use strict';

const Player = use('App/Models/Player');

class PlayerController {
  async getPlayers() {
    return await Player.query().paginate();
  }
}

module.exports = PlayerController;