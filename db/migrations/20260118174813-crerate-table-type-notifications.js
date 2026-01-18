'use strict';

const {TYPE_NOTIFICATION_TABLE, TypeNotificationSchema} = require("../models/typeNotifications.models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(TYPE_NOTIFICATION_TABLE, TypeNotificationSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(TYPE_NOTIFICATION_TABLE);
  }
};
