'use strict';

const { REACTION_TABLE } = require("../models/reaction.models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(REACTION_TABLE, [
      { name: "Like", image_url: "https://images/like.png", created_at: new Date()},
      { name: "Love", image_url: "https://images/love.png", created_at: new Date()},
      { name: "Haha", image_url: "https://images/haha.png", created_at: new Date()},
      { name: "Wow", image_url: "https://images/wow.png", created_at: new Date()},
      { name: "Sad", image_url: "https://images/sad.png", created_at: new Date()},
      { name: "Angry", image_url: "https://images/angry.png", created_at: new Date()},
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(REACTION_TABLE, null, {});
  }
};
