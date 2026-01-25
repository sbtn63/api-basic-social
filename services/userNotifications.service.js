const { models } = require("../libs/sequelize");

const { insertAuditLog } = require("./audit.service");
const { ACTIONS_AUDIT, TABLE_NAMES } = require("./consts");

const insertUserNotification = async (
  toUserId,
  fromUserId,
  typeNotificationId,
  postId,
  commentId,
  message
) => {
  try {
    const userNotification = await models.UserNotification.create({
      toUserId,
      fromUserId,
      typeNotificationId,
      postId,
      commentId,
      message
    });

    await insertAuditLog(
      userNotification.fromUserId,
      ACTIONS_AUDIT.INSERT,
      TABLE_NAMES.USER_NOTIFICATION_TABLE,
      userNotification.id,
      null,
      userNotification
    );

    return !!userNotification;
  } catch (error) {
    console.error('Insert User Notification failed, continuing process:', error);
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

      await insertAuditLog(
        userNotification.toUserId,
        ACTIONS_AUDIT.UPDATE,
        TABLE_NAMES.USER_NOTIFICATION_TABLE,
        userNotification.id,
        oldUserNotification,
        userNotification
      );

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

      await insertAuditLog(
        oldUserNotification.toUserId,
        ACTIONS_AUDIT.DELETE,
        TABLE_NAMES.USER_NOTIFICATION_TABLE,
        oldUserNotification.id,
        oldUserNotification,
        null
      );

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
