'use strict';

const { COMMENT_TABLE } = require("../models/comment.models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addIndex(COMMENT_TABLE, ['post_id']);
  },

  async down (queryInterface) {

  }
};
