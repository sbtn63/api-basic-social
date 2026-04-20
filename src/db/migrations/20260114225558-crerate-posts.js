'use strict';

import { PostSchema, POST_TABLE } from '../models/post.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.createTable(POST_TABLE, PostSchema);
};

export async function down (queryInterface) {
    await queryInterface.dropTable(POST_TABLE);
};

