const { models } = require("../libs/sequelize");
const { SERVICE_MESSAGES } = require("./consts");

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
    console.error(SERVICE_MESSAGES.AUDIT_FAILED, error);
    return false;
  }
};

module.exports = {
  insertAuditLog
};
