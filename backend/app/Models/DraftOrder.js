'use strict';

const Model = use('Model');

class DraftOrder extends Model {
  static get table () {
    return 'draft_order'
  }


  team() {
    return this.belongsTo('App/Models/Team');
  }

  leaguePlayer() {
    return this.hasOne('App/Models/LeaguePlayer', 'player_selected_id', 'id');
  }


}

module.exports = DraftOrder;
