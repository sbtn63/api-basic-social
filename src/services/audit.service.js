import { models } from '../libs/sequelize.js';
import { SERVICE_MESSAGES } from './consts.js';

const insertAuditLog = async ({
  userId,
  action,
  tableName,
  recordId,
  oldData = null,
  newData = null
}) => {
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

export {
  insertAuditLog
};
