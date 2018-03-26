'use strict';

const Model = use('Model');

class Team extends Model {
  static get table() {
    return 'team';
  }

  league() {
    return this.belongsTo('App/Models/League');
  }

  user() {
    return this.belongsTo('App/Models/User');
  }
}

module.exports = Team;
