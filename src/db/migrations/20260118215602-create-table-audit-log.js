'use strict';

const { AUDIT_LOG_TABLE, AuditLogSchema } = require("../models/auditLogs.models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(AUDIT_LOG_TABLE, AuditLogSchema);
    await queryInterface.addIndex(AUDIT_LOG_TABLE, ['table_name', 'record_id']);
    await queryInterface.addIndex(AUDIT_LOG_TABLE, ['user_id', 'action']);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(AUDIT_LOG_TABLE);
  }
};
