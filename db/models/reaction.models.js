const { Model, DataTypes, Sequelize } = require("sequelize");

const REACTION_TABLE = 'reactions';

const ReactionSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },

  description: {
    type: DataTypes.TEXT
  },

  imageUrl: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'image_url'
  },

  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'created_at'
  },
};

class Reaction extends Model {
  static associate(models){}

  static config(sequelize){
    return {
      sequelize,
      tableName: REACTION_TABLE,
      modelName: 'Reaction',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    };
  }
}

module.exports = {
  REACTION_TABLE,
  ReactionSchema,
  Reaction
};
