'use strict';

import { COMMENT_TABLE } from '../models/comment.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.addIndex(COMMENT_TABLE, ['post_id']);
};

export async function down () {

};

