'use strict'

class DraftOrderWsController {
  constructor ({ socket, request }) {
    this.socket = socket;
    this.request = request
  }

  onMessage(message) {
    console.log('got message', message);
  }
}

module.exports = DraftOrderWsController;
