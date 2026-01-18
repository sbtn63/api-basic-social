'use strict';

const {USER_NOTIFICATION_TABLE, UserNotificationSchema} = require("../models/userNotifications.models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(USER_NOTIFICATION_TABLE, UserNotificationSchema);
    await queryInterface.addIndex(USER_NOTIFICATION_TABLE, ['to_user_id', 'is_read']);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(USER_NOTIFICATION_TABLE);
  }
};
