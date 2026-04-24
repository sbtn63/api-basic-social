import { Model, DataTypes, Sequelize } from 'sequelize';

import { USER_TABLE } from './user.models.js';
import { POST_TABLE } from './post.models.js';
import { REACTION_TABLE } from './reaction.models.js';

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
  static associate(models){
    // Publicacion de la reaccion
    this.belongsTo(models.Post, {
      as: 'post',
      foreignKey: 'postId'
    });

    // Usuario que reacciono
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });

    // Tipo de reacccion
    this.belongsTo(models.Reaction, {
      as: 'reaction',
      foreignKey: 'reactionId'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: POST_REACTION_TABLE,
      modelName: 'PostReaction',
      timestamps: true,
    };
  }
}

export {
  POST_REACTION_TABLE,
  PostReactionSchema,
  PostReaction
};
