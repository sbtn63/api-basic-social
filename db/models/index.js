const { User, UserSchema } = require('./user.models');
const { UserFollow, UserFollowSchema } = require('./userFollows.model');
const { Post, PostSchema } = require("./post.models");
const { Comment, CommentSchema } = require("./comment.models");


function setupModels(sequelize){
  // Inicializacion de modelos
  User.init(UserSchema, User.config(sequelize));
  UserFollow.init(UserFollowSchema, UserFollow.config(sequelize));
  Post.init(PostSchema, Post.config(sequelize));
  Comment.init(CommentSchema, Comment.config(sequelize));

  //Asociaciones de modelos
  User.associate(sequelize.models);
  Post.associate(sequelize.models);
  Comment.associate(sequelize.models);
}

module.exports = setupModels;
