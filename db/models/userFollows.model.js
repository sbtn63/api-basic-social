const { Model, DataTypes, Sequelize } = require("sequelize");
const { USER_TABLE } = require("./user.models");

const USER_FOLLOW_TABLE = 'user_follows';

const UserFollowSchema = {
  followerId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'follower_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  followedId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'followed_id',
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
};

class UserFollow extends Model {
  static associate(models){}

  static config(sequelize){
    return {
      sequelize,
      tableName: USER_FOLLOW_TABLE,
      modelName: 'UserFollow',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      validate: {
        notSelfFollow() {
          if(this.followerId === this.followedId){
            throw new Error('No puedes seguirte a ti mismo');
          }
        }
      },
      /*indexes: [
        {
          unique: true,
          fields: ['follower_id', 'followed_id']
        }
      ]*/
    };
  }
}

module.exports = {
  USER_FOLLOW_TABLE,
  UserFollowSchema,
  UserFollow
};
