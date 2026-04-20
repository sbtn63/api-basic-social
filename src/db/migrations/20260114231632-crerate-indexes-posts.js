'use strict';

import { POST_TABLE } from '../models/post.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.addIndex(POST_TABLE, ['user_id', 'created_at']);
};

export async function down () {

};

