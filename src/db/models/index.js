const { User, UserSchema } = require('./user.models');
const { UserFollow, UserFollowSchema } = require('./userFollows.model');
const { Post, PostSchema } = require("./post.models");
const { Comment, CommentSchema } = require("./comment.models");
const { Reaction, ReactionSchema } = require("./reaction.models");
const { PostReaction, PostReactionSchema } = require("./postReactions.models");
const { TypeNotification, TypeNotificationSchema } = require("./typeNotifications.models");
const { UserNotification, UserNotificationSchema } = require("./userNotifications.models");
const { AuditLog, AuditLogSchema } = require('./auditLogs.models');


function setupModels(sequelize){
  // Inicializacion de modelos
  User.init(UserSchema, User.config(sequelize));
  UserFollow.init(UserFollowSchema, UserFollow.config(sequelize));
  Post.init(PostSchema, Post.config(sequelize));
  Comment.init(CommentSchema, Comment.config(sequelize));
  Reaction.init(ReactionSchema, Reaction.config(sequelize));
  PostReaction.init(PostReactionSchema, PostReaction.config(sequelize));
  TypeNotification.init(TypeNotificationSchema, TypeNotification.config(sequelize));
  UserNotification.init(UserNotificationSchema, UserNotification.config(sequelize));
  AuditLog.init(AuditLogSchema, AuditLog.config(sequelize));

  //Asociaciones de modelos
  User.associate(sequelize.models);
  Post.associate(sequelize.models);
  Comment.associate(sequelize.models);
  PostReaction.associate(sequelize.models);
  UserNotification.associate(sequelize.models);
}

module.exports = setupModels;
