'use strict';
const DraftOrder = use('App/Models/DraftOrder');

class DraftOrderController {


  getDraftOrders({params}) {
    return DraftOrder
      .query()
      .on('query', console.log)
      .where('league_id', '=', params.league)
      .with('leaguePlayer')
      .with('leaguePlayer.player')
      .with('leaguePlayer.player.positions')
      .with('team')
      .fetch();
  }
}

module.exports = DraftOrderController;
