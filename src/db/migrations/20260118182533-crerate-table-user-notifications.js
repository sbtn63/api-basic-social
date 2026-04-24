'use strict';

import { USER_NOTIFICATION_TABLE, UserNotificationSchema } from '../models/userNotifications.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.createTable(USER_NOTIFICATION_TABLE, UserNotificationSchema);
    await queryInterface.addIndex(USER_NOTIFICATION_TABLE, ['to_user_id', 'is_read']);
};

export async function down (queryInterface) {
    await queryInterface.dropTable(USER_NOTIFICATION_TABLE);
};

