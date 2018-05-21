// Update with your config settings.
let util ;
try {
    util = require('./server/util.js');
} catch (err) {
    try {
        util = require('./build/server/util.js');
    } catch (err) {
        console.log("Please run `npm run build-backend` before using knex");
    }
}
const os = require('os');

const user = util.envOrElse('PG_USER', os.userInfo().username)
const password = util.envOrElse('PG_PASSWORD', '')
const dbname = util.envOrElse('PG_DBNAME', 'postgres')
const host = util.envOrElse('PG_HOST', 'localhost')
const port = util.envOrElse('PG_PORT', 5432)

const connection = util.envOrElse('DATABASE_URL', {
    host: host,
    database: dbname,
    user:     user,
    password: password,
    port: port
});
const useSSL = util.envOrElse('USE_SSL', 'false') === 'true';

var pg = require('pg');
pg.defaults.ssl = useSSL;

module.exports = {
  client: 'pg',
  connection: connection,
  ssl: useSSL,
  pool: {
    min: 2,
    max: 9,
    requestTimeout: 20000, // https://github.com/tgriesser/knex/issues/1382#issuecomment-219423066
  },
  acquireConnectionTimeout: 60000, // default
  migrations: {
    tableName: 'knex_migrations'
  }
};
