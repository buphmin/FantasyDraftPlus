'use strict'

const Model = use('Model');

class League extends Model {
  static get table () {
    return 'league'
  }

  teams() {
    return this.hasMany('App/Models/Team');
  }
}

module.exports = League;
