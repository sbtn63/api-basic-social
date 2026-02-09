'use strict';

const { TYPE_NOTIFICATION_TABLE } = require("../models/typeNotifications.models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(TYPE_NOTIFICATION_TABLE, null, {});
    await queryInterface.bulkInsert(TYPE_NOTIFICATION_TABLE, [
      { name: "New Followed", created_at: new Date(), updated_at: new Date()},
      { name: "Post Comment", created_at: new Date(), updated_at: new Date()},
      { name: "New Post", created_at: new Date(), updated_at: new Date()},
      { name: "Post Reaction", created_at: new Date(), updated_at: new Date()},
      { name: "Updated Post", created_at: new Date(), updated_at: new Date()},
      { name: "Deleted Post", created_at: new Date(), updated_at: new Date()},
      { name: "Response Comment", created_at: new Date(), updated_at: new Date()},
      { name: "Edit Comment", created_at: new Date(), updated_at: new Date()},
      { name: "Delete Comment", created_at: new Date(), updated_at: new Date()},
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(TYPE_NOTIFICATION_TABLE, null, {});
  }
};
