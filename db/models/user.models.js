const { Model, DataTypes, Sequelize } = require("sequelize");

const USER_TABLE = 'users';

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  firstName: {
    type: DataTypes.STRING,
    field: 'first_name'
  },

  lastName: {
    type: DataTypes.STRING,
    field: 'last_name'
  },

  avatarUrl: {
    type: DataTypes.STRING,
    field: 'avatar_url'
  },

  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },

  passwordHash: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'password_hash'
  },

  lastConnection: {
    type: DataTypes.DATE,
    field: 'last_connection'
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

class User extends Model {
  static associate(models){
    // Usuarios que el usuario sigue
    this.belongsToMany(models.User, {
      through: models.UserFollow,
      as: 'following',
      foreignKey: 'followerId',
      otherKey: 'followedId'
    });

    // Usuarios que siguen al usuario
    this.belongsToMany(models.User, {
      through: models.UserFollow,
      as: 'followers',
      foreignKey: 'followedId',
      otherKey: 'followerId'
    });

    // Publicaciones usuario
    this.hasMany(models.Post, {
      as: 'posts',
      foreignKey: 'userId'
    });

    // Reacciones usuario
    this.hasMany(models.PostReaction, {
      as: 'reactions',
      foreignKey: 'userId'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
  }
}

module.exports = {
  USER_TABLE,
  UserSchema,
  User
};
