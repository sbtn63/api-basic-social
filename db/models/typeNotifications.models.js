const { Model, DataTypes, Sequelize } = require("sequelize");

const TYPE_NOTIFICATION_TABLE = 'type_notifications';

const TypeNotificationSchema = {
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

class TypeNotification extends Model {
  static config(sequelize){
    return {
      sequelize,
      tableName: TYPE_NOTIFICATION_TABLE,
      modelName: 'TypeNotification',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };
  }
}

module.exports = {
  TYPE_NOTIFICATION_TABLE,
  TypeNotificationSchema,
  TypeNotification
};
