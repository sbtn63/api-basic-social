'use strict';

import { UserFollowSchema, USER_FOLLOW_TABLE } from '../models/userFollows.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.createTable(USER_FOLLOW_TABLE, UserFollowSchema);
};

export async function down (queryInterface) {
    await queryInterface.dropTable(USER_FOLLOW_TABLE);
};

