const { Pool } = require('pg')
const keys = require('../config/keys');

const User = new Pool({
  user: keys.postgresdb.user, 
  host: keys.postgresdb.host,
  database: keys.postgresdb.database, 
  password:keys.postgresdb.password, 
  port: keys.postgresdb.port, 
  ssl:keys.postgresdb.ssl,
});

module.exports = User;