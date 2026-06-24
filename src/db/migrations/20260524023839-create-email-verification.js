'use strict';

import { EmailVerificationSchema, EMAIL_VEREFICATION_TABLE} from '../models/emailVerification.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.createTable(EMAIL_VEREFICATION_TABLE, EmailVerificationSchema);
};

export async function down (queryInterface) {
    await queryInterface.dropTable(EMAIL_VEREFICATION_TABLE);
};

