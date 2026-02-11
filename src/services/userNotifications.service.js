const { models } = require("../libs/sequelize");

const { insertAuditLog } = require("./audit.service");
const { ACTIONS_AUDIT, TABLE_NAMES, SERVICE_MESSAGES } = require("./consts");

const insertUserNotification = async ({
  toUserId,
  fromUserId,
  typeNotificationId,
  postId = null,
  commentId = null,
  message
}) => {
  try {
    const userNotification = await models.UserNotification.create({
      toUserId,
      fromUserId,
      typeNotificationId,
      postId,
      commentId,
      message
    });

    await insertAuditLog({
      userId: userNotification.fromUserId,
      action: ACTIONS_AUDIT.INSERT,
      tableName: TABLE_NAMES.USER_NOTIFICATION_TABLE,
      recordId: userNotification.id,
      newData: userNotification.toJSON()
    });

    return !!userNotification;
  } catch (error) {
    console.error(SERVICE_MESSAGES.NOTIFICATION_FAILED, error);
    return false;
  }
};

const readUserNotification = async (
  idNotification
) => {
  try {
    const userNotification = await models.UserNotification.findByPk(idNotification);

    if(userNotification){
      const oldUserNotification = userNotification.toJSON();
      userNotification.isRead = true;
      await userNotification.save();

      await insertAuditLog({
        userId: userNotification.toUserId,
        action: ACTIONS_AUDIT.UPDATE,
        tableName: TABLE_NAMES.USER_NOTIFICATION_TABLE,
        recordId: userNotification.id,
        oldData: oldUserNotification,
        newData: userNotification.toJSON()
      });

      return true;
    }

    console.error('User notification not found');
    return false;
  } catch (error) {
    console.error('Read User Notification failed, continuing process:', error);
    return false;
  }
};

const deleteUserNotification = async (
  idNotification
) => {
  try {
    const userNotification = await models.UserNotification.findByPk(idNotification);

    if(userNotification){
      const oldUserNotification = userNotification.toJSON();
      await userNotification.destroy();

      await insertAuditLog({
        userId: oldUserNotification.toUserId,
        action: ACTIONS_AUDIT.DELETE,
        tableName: TABLE_NAMES.USER_NOTIFICATION_TABLE,
        recordId: oldUserNotification.id,
        oldData: oldUserNotification
      });

      return true;
    }

    console.error('User notification not found');
    return false;
  } catch (error) {
    console.error('Delete User Notification failed, continuing process:', error);
    return false;
  }
};


module.exports = {
  insertUserNotification,
  readUserNotification,
  deleteUserNotification
};
