import { User, UserSchema } from './user.models.js';
import { UserFollow, UserFollowSchema } from './userFollows.model.js';
import { Post, PostSchema } from './post.models.js';
import { Comment, CommentSchema } from './comment.models.js';
import { Reaction, ReactionSchema } from './reaction.models.js';
import { PostReaction, PostReactionSchema } from './postReactions.models.js';
import { TypeNotification, TypeNotificationSchema } from './typeNotifications.models.js';
import { UserNotification, UserNotificationSchema } from './userNotifications.models.js';
import { AuditLog, AuditLogSchema } from './auditLogs.models.js';


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

export default setupModels;
