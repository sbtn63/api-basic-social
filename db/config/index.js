const config = require('../../config/index')

module.exports = {
  dev: {
    host: config.dbHost,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
    dialect: config.dbDialect
  }
};
