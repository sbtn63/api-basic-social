'use strict';

const { CommentSchema, COMMENT_TABLE } = require("../models/comment.models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(COMMENT_TABLE, CommentSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(COMMENT_TABLE);
  }
};
