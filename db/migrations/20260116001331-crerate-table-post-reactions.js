'use strict';

const {POST_REACTION_TABLE, PostReactionSchema} = require("../models/postReactions.models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(POST_REACTION_TABLE, PostReactionSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(POST_REACTION_TABLE);
  }
};
