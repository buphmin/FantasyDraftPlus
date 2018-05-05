'use strict';

class LeaguePlayerUpdateController {
  constructor ({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }

  onMessage(message) {
    console.log('got message', message);
    this.socket.broadcastToAll('message', message);
  }
}

module.exports = LeaguePlayerUpdateController;
