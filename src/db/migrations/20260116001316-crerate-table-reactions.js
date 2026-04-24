'use strict';

import { REACTION_TABLE, ReactionSchema } from '../models/reaction.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.createTable(REACTION_TABLE, ReactionSchema);
};

export async function down (queryInterface) {
    await queryInterface.dropTable(REACTION_TABLE);
};

