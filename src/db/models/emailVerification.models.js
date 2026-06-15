import { Model, DataTypes, Sequelize } from 'sequelize';

const EMAIL_VEREFICATION_TABLE = "email_verifications";

const EmailVerificationSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  email: {
    allowNull: false,
    type: DataTypes.STRING
  },

  code: {
    allowNull: false,
    type: DataTypes.STRING(6),
    validate: {
      isNumeric: true,
      len: [6, 6]
    }
  },

  isUsed: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: "is_used"
  },

  expiresAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'expires_at'
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

class EmailVerification extends Model {
  static config(sequelize){
    return {
      sequelize,
      tableName: EMAIL_VEREFICATION_TABLE,
      modelName: 'EmailVerification',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };
  }
}

export {
  EMAIL_VEREFICATION_TABLE,
  EmailVerificationSchema,
  EmailVerification
};
