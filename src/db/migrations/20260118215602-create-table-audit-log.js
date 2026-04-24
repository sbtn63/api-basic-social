'use strict';

import { AUDIT_LOG_TABLE, AuditLogSchema } from '../models/auditLogs.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
    await queryInterface.createTable(AUDIT_LOG_TABLE, AuditLogSchema);
    await queryInterface.addIndex(AUDIT_LOG_TABLE, ['table_name', 'record_id']);
    await queryInterface.addIndex(AUDIT_LOG_TABLE, ['user_id', 'action']);
};

export async function down (queryInterface) {
    await queryInterface.dropTable(AUDIT_LOG_TABLE);
};

