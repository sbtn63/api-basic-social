import config from '../config/index.cjs';
import { Sequelize } from 'sequelize';
import setupModels from '../db/models/index.js';

const URI = `${config.dbDialect}://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI, {
  dialect: config.dbDialect,
  logging: true
});

setupModels(sequelize);

export const models = sequelize.models;
export default sequelize;
