const { models } = require("../libs/sequelize");

const insertAuditLog = async (
  userId,
  action,
  tableName,
  recordId,
  oldData,
  newData
) => {
  try {
    const audit = await models.AuditLog.create({
      userId,
      action,
      tableName,
      recordId,
      oldData,
      newData
    })
    return !!audit;
  } catch (error) {
    console.error('Audit log failed, continuing process:', error);
    return false;
  }
};

module.exports = {
  insertAuditLog
};
