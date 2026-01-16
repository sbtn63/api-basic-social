'use strict';

const { REACTION_TABLE, ReactionSchema } = require("../models/reaction.models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(REACTION_TABLE, ReactionSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(REACTION_TABLE);
  }
};
