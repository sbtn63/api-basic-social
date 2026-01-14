'use strict';

const {POST_TABLE} = require('../models/post.models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex(POST_TABLE, ['user_id', 'created_at']);
  },

  async down (queryInterface) {

  }
};
