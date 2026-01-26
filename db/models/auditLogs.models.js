const { Model, DataTypes, Sequelize } = require("sequelize");

const { USER_TABLE } = require("./user.models");

const AUDIT_LOG_TABLE = "audit_logs";

const AuditLogSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  userId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },

  action: {
    allowNull: false,
    type: DataTypes.STRING
  },

  tableName: {
    allowNull: false,
    type: DataTypes.STRING,
    field: "table_name"
  },

  recordId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'record_id'
  },

  oldData: {
    allowNull: true,
    type: DataTypes.JSON,
    field: 'old_data',
  },

  newData: {
    allowNull: true,
    type: DataTypes.JSON,
    field: 'new_data',
  },

  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'created_at'
  }
};

class AuditLog extends Model {
  static config(sequelize){
    return {
      sequelize,
      tableName: AUDIT_LOG_TABLE,
      modelName: 'AuditLog',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    };
  }
}

module.exports = {
  AUDIT_LOG_TABLE,
  AuditLogSchema,
  AuditLog
};
