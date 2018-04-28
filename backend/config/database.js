'use strict'

const Env = use('Env')
const Helpers = use('Helpers')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: Env.get('DB_CONNECTION', 'sqlite'),

  /*
  |--------------------------------------------------------------------------
  | Sqlite
  |--------------------------------------------------------------------------
  |
  | Sqlite is a flat file database and can be good choice under development
  | environment.
  |
  | npm i --save sqlite3
  |
  */
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: Helpers.databasePath('development.sqlite')
    },
    useNullAsDefault: true,
    debug: Env.get('DB_DEBUG', false)
  },

  /*
  |--------------------------------------------------------------------------
  | MySQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MySQL database.
  |
  | npm i --save mysql
  |
  */
  // mysql2: {
  //   client: 'mysql2',
  //   connection: {
  //     host: Env.get('DB_HOST', 'fantasydraftplusdb1-0.couyfintzatq.us-east-2.rds.amazonaws.com'),
  //     port: Env.get('DB_PORT', '3306'),
  //     user: Env.get('DB_USER', 'root'),
  //     password: Env.get('DB_PASSWORD', 'ctPxjDmeZc4ySKmsSzc12LgNcc24MLKC'),
  //     database: Env.get('DB_DATABASE', 'draft')
  //   },
  //   debug: Env.get('DB_DEBUG', false)
  //   // debug: true
  // },
  mysql2: {
    client: 'mysql2',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', '3306'),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', 'Sashi12.'),
      database: Env.get('DB_DATABASE', 'draft')
    },
    debug: Env.get('DB_DEBUG', false)
    // debug: true
  },

  /*
  |--------------------------------------------------------------------------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */
  pg: {
    client: 'pg',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis')
    },
    debug: Env.get('DB_DEBUG', false)
  }
}
