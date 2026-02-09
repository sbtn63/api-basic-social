const config = require('../../config/index');

module.exports = {
  dev: {
    host: config.dbHost,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
    dialect: config.dbDialect,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  },
  example: {
    host: config.dbHost,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
    dialect: config.dbDialect,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  },
  qa: {
    host: config.dbHost,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
    dialect: config.dbDialect,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
