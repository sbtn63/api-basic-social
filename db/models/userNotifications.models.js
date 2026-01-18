const { Model, DataTypes, Sequelize } = require("sequelize");

const { USER_TABLE } = require("./user.models");
const { POST_TABLE } = require("./post.models");
const { COMMENT_TABLE } = require("./comment.models");
const { TYPE_NOTIFICATION_TABLE } = require("./typeNotifications.models");

const USER_NOTIFICATION_TABLE = 'user_notifications';

const UserNotificationSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  toUserId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'to_user_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  fromUserId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'from_user_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  typeNotificationId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'type_notification_id',
    references: {
      model: TYPE_NOTIFICATION_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  postId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'post_id',
    references: {
      model: POST_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  commentId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'comment_id',
    references: {
      model: COMMENT_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  message: {
    allowNull: false,
    type: DataTypes.TEXT,
  },

  isRead: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    field: 'is_read',
    defaultValue: false
  },

  sendDate: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'send_date'
  },

  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'created_at'
  },

  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'updated_at'
  }
};

class UserNotification extends Model {
  static associate(models){
    // User a quien va la notificacion
    this.belongsTo(models.User, {
      as: 'toUser',
      foreignKey: 'toUserId'
    });

    // User que envio la notificacion
    this.belongsTo(models.User, {
      as: 'fromUser',
      foreignKey: 'fromUserId'
    });

    // Type Notification enviada
    this.belongsTo(models.TypeNotification, {
      as: 'typeNotification',
      foreignKey: 'typeNotificationId'
    });

    // Post que se realizo la accion
    this.belongsTo(models.Post, {
      as: 'post',
      foreignKey: 'postId'
    });

     // Comentario que se realizo la accion
    this.belongsTo(models.Comment, {
      as: 'comment',
      foreignKey: 'commentId'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: USER_NOTIFICATION_TABLE,
      modelName: 'UserNotification',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
  }
}

module.exports = {
  USER_NOTIFICATION_TABLE,
  UserNotificationSchema,
  UserNotification
};
