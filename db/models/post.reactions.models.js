const { Model, DataTypes, Sequelize } = require("sequelize");

const { USER_TABLE } = require("./user.models");
const { POST_TABLE } = require("./post.models");
const { REACTION_TABLE } = require("./reaction.models");

const POST_REACTION_TABLE = 'post_reactions';

const PostReactionSchema = {
  postId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'post_id',
    references: {
      model: POST_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  userId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  reactionId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'reaction_id',
    references: {
      model: REACTION_TABLE,
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

class PostReaction extends Model {
  static associate(models){}

  static config(sequelize){
    return {
      sequelize,
      tableName: POST_REACTION_TABLE,
      modelName: 'PostReaction',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
  }
}

module.exports = {
  POST_REACTION_TABLE,
  PostReactionSchema,
  PostReaction
};
