'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('user', table => {
      table.increments()
      table.string('username', 255).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
