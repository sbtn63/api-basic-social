const { User, UserSchema } = require('./user.models');

function setupModels(sequelize){
  // Inicializacion de modelos
  User.init(UserSchema, User.config(sequelize));

  //Asociaciones de modelos
  User.associate(sequelize.models);
}

module.exports = setupModels;
