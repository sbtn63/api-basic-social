const config = require("../config/index");
const { Sequelize } = require("sequelize");
const setupModels = require("../db/models/index");

const URI = `${config.dbDialect}://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI, {
  dialect: config.dbDialect,
  logging: true
});

setupModels(sequelize);

module.exports = sequelize;
