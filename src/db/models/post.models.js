const { Model, DataTypes, Sequelize } = require("sequelize");
const { USER_TABLE } = require("./user.models");

const POST_TABLE = 'posts';

const PostSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  description: {
    type: DataTypes.TEXT
  },

  imageUrl: {
    type: DataTypes.STRING,
    field: 'image_url'
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

class Post extends Model {
  static associate(models){
    // Usuario del post
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });

    // Comentarios de la publicacion
    this.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'postId'
    });

    // Reacciones de la publicacion
    this.belongsToMany(models.Reaction, {
      through: models.PostReaction,
      as: 'reactions',
      foreignKey: 'post_id',
      otherKey: 'reaction_id'
    });

    this.hasMany(models.PostReaction, {
      as: 'postReactions',
      foreignKey: 'post_id'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: POST_TABLE,
      modelName: 'Post',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      defaultScope: {
        attributes: { exclude: [
          'created_at', 'updatedAt'
        ] }
      },
      validate: {
        notContent() {
          if(!this.description && !this.imageUrl){
            throw new Error('Se debe ingresar una imagen o descripción');
          }
        }
      }
    };
  }
}

module.exports = {
  POST_TABLE,
  PostSchema,
  Post
};
