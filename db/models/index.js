const { User, UserSchema } = require('./user.models');
const { UserFollow, UserFollowSchema } = require('./userFollows.model');

function setupModels(sequelize){
  // Inicializacion de modelos
  User.init(UserSchema, User.config(sequelize));
  UserFollow.init(UserFollowSchema, User.config(sequelize));

  //Asociaciones de modelos
  User.associate(sequelize.models);
  UserFollow.associate(sequelize.models);
}

module.exports = setupModels;
