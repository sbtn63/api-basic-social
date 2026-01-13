'use strict';

const {UserFollowSchema, USER_FOLLOW_TABLE} = require("../models/userFollows.model");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(USER_FOLLOW_TABLE, UserFollowSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(USER_FOLLOW_TABLE);
  }
};
