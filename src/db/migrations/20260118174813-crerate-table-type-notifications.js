'use strict';

import { TYPE_NOTIFICATION_TABLE, TypeNotificationSchema } from '../models/typeNotifications.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.createTable(TYPE_NOTIFICATION_TABLE, TypeNotificationSchema);
};

export async function down (queryInterface) {
    await queryInterface.dropTable(TYPE_NOTIFICATION_TABLE);
};

