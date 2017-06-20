// Update with your config settings.
const util = require('./server/util.js');
const os = require('os');

const user = util.envOrElse('PG_USER', os.userInfo().username)
const password = util.envOrElse('PG_PASSWORD', '')
const dbname = util.envOrElse('PG_DBNAME', 'postgres')
const host = util.envOrElse('PG_HOST', 'localhost')

module.exports = {
  client: 'pg',
  connection: {
    database: dbname,
    user:     user,
    password: password
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
