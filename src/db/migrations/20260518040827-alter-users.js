'use strict';

import { USER_TABLE } from '../models/user.models.js';

export async function up (queryInterface, Sequelize) {
   await queryInterface.addColumn(USER_TABLE, 'is_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn(USER_TABLE, 'email_verified_at', {
      type: Sequelize.DATE
    });
};

export async function down (queryInterface) {
    await queryInterface.removeColumn(USER_TABLE, 'is_verified');
    await queryInterface.removeColumn(USER_TABLE, 'email_verified_at');
};
