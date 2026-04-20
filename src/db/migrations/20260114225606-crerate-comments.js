'use strict';

import { CommentSchema, COMMENT_TABLE } from '../models/comment.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.createTable(COMMENT_TABLE, CommentSchema);
};

export async function down (queryInterface) {
    await queryInterface.dropTable(COMMENT_TABLE);
};

