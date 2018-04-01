'use strict';

const Model = use('Model');

class DraftOrder extends Model {
  static get table () {
    return 'draft_order'
  }
}

module.exports = DraftOrder;
