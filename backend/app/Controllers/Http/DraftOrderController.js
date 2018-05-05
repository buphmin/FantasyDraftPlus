'use strict';
const DraftOrder = use('App/Models/DraftOrder');

class DraftOrderController {


  getDraftOrders({params}) {
    return DraftOrder
      .query()
      .where('league_id', '=', params.league)
      .with('leaguePlayer')
      .with('leaguePlayer.player')
      .with('leaguePlayer.player.positions')
      .fetch();
  }
}

module.exports = DraftOrderController;
