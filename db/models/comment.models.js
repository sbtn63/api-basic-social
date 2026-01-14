const { Model, DataTypes, Sequelize } = require("sequelize");
const { USER_TABLE } = require("./user.models");
const { POST_TABLE } = require("./post.models");

const COMMENT_TABLE = 'comments';

const CommentSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  content: {
    allowNull: false,
    type: DataTypes.TEXT
  },

  imageUrl: {
    type: DataTypes.STRING,
    field: 'image_url'
  },

  postId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: POST_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  parentCommentId: {
    type: DataTypes.INTEGER,
    field: 'parent_comment_id',
    references: {
      model: COMMENT_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
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

class Comment extends Model {
  static associate(models){

  }

  static config(sequelize){
    return {
      sequelize,
      tableName: COMMENT_TABLE,
      modelName: 'Comment',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };
  }
}

module.exports = {
  COMMENT_TABLE,
  CommentSchema,
  Comment
};
