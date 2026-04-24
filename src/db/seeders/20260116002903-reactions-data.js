'use strict';

import { REACTION_TABLE } from '../models/reaction.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.bulkInsert(REACTION_TABLE, [
    { name: "Like", image_url: "https://images/like.png", created_at: new Date() },
    { name: "Love", image_url: "https://images/love.png", created_at: new Date() },
    { name: "Haha", image_url: "https://images/haha.png", created_at: new Date() },
    { name: "Wow", image_url: "https://images/wow.png", created_at: new Date() },
    { name: "Sad", image_url: "https://images/sad.png", created_at: new Date() },
    { name: "Angry", image_url: "https://images/angry.png", created_at: new Date() },
  ]);
};

export async function down(queryInterface) {
  await queryInterface.bulkDelete(REACTION_TABLE, null, {});
};

