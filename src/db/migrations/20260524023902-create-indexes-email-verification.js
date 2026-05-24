'use strict';

import { EMAIL_VEREFICATION_TABLE } from '../models/emailVerification.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.addIndex(EMAIL_VEREFICATION_TABLE, ['email', 'code']);
};

export async function down () {

};

