'use strict';

import { USER_TABLE } from '../models/user.models.js';

export async function up (queryInterface, Sequelize) {
  const tableDefinition = await queryInterface.describeTable(USER_TABLE);

  if (!tableDefinition.is_verified) {
    await queryInterface.addColumn(USER_TABLE, 'is_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }

  if (!tableDefinition.email_verified_at) {
    await queryInterface.addColumn(USER_TABLE, 'email_verified_at', {
      type: Sequelize.DATE
    });
  }
}

export async function down (queryInterface) {
  const tableDefinition = await queryInterface.describeTable(USER_TABLE);

  if (tableDefinition.is_verified) {
    await queryInterface.removeColumn(USER_TABLE, 'is_verified');
  }
  if (tableDefinition.email_verified_at) {
    await queryInterface.removeColumn(USER_TABLE, 'email_verified_at');
  }
}
