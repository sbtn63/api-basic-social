'use strict';

import { POST_REACTION_TABLE, PostReactionSchema } from '../models/postReactions.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.createTable(POST_REACTION_TABLE, PostReactionSchema);
};

export async function down (queryInterface) {
    await queryInterface.dropTable(POST_REACTION_TABLE);
};

