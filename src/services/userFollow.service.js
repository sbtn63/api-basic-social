const { models } = require("../libs/sequelize");
const { SERVICE_MESSAGES, TYPE_NOTIFICATION, ACTIONS_AUDIT, TABLE_NAMES } = require("./consts");
const { getUserById } = require("./user.service");
const { insertAuditLog } = require("./audit.service");
const { insertUserNotification } = require("./userNotifications.service");
const ResponseError = require("../schemas/responseError.schema");
const ResponseSuccess = require("../schemas/responseSuccess.schema");

const addFollowing = async (followerId, followedId) => {
  const { follower, followed } = await getActors(followerId, followedId, SERVICE_MESSAGES.FOLLOWING_CONFLICT);

  const alreadyFollowing = await follower.hasFollowing(followed);
  if (alreadyFollowing) {
    return ResponseSuccess.success(SERVICE_MESSAGES.FOLLOWED_EXISTS, {"followed": true}, 200);
  }

  const following = await createFollow(follower, followed);

  await insertAuditLog({
    userId: follower.id,
    action: ACTIONS_AUDIT.INSERT,
    tableName: TABLE_NAMES.USER_FOLLOW_TABLE,
    recordId: followed.id,
    newData: following.toJSON()
  });

  await insertUserNotification({
    toUserId: followed.id,
    fromUserId: follower.id,
    typeNotificationId: TYPE_NOTIFICATION.NEW_FOLLOWED,
    message: SERVICE_MESSAGES.NEW_FOLLOWED_NOTIFICATION_MESAGGE
  });

  return ResponseSuccess.success(SERVICE_MESSAGES.NEW_FOLLOWED, {"followed": true}, 201);
};

const removeFollowing = async (followerId, followedId) => {
  const { follower, followed } = await getActors(followerId, followedId, SERVICE_MESSAGES.UNFOLLOW_CONFLICT);

  const followRecord = await getFollow(follower, followed);
  if (!followRecord) {
    return ResponseSuccess.success(SERVICE_MESSAGES.UNFOLLOW_NOT_FOUND, {"followed": false}, 200);
  }

  const deletedData = followRecord.toJSON();
  await followRecord.destroy();

  await insertAuditLog({
    userId: follower.id,
    action: ACTIONS_AUDIT.DELETE,
    tableName: TABLE_NAMES.USER_FOLLOW_TABLE,
    recordId: followed.id,
    oldData: deletedData
  });

  return ResponseSuccess.success(SERVICE_MESSAGES.UNFOLLOW_SUCCESS, {"followed": false}, 200);
};

const createFollow = async (follower, followed) => {
  const following = await models.UserFollow.create({
    followedId : followed.id,
    followerId: follower.id
  });

  return following;
}

const getFollow = async (follower, followed) => {
  const follow = await models.UserFollow.findOne({where: {
    followedId: followed.id,
    followerId: follower.id
  }});
  return follow;
};

const ensureNotSelfFollowing = (followerId, followedId, message) => {
  if (Number(followerId) === Number(followedId)) {
    throw new ResponseError(message, 409);
  }
};

const getActors = async (followerId, followedId, conflictMessage) => {
  ensureNotSelfFollowing(followerId, followedId, conflictMessage);

  const follower = await getUserById(followerId, SERVICE_MESSAGES.FOLLOWER_NOT_FOUND);
  const followed = await getUserById(followedId, SERVICE_MESSAGES.FOLLOWED_NOT_FOUND);

  return { follower, followed };
};

module.exports = {
  addFollowing,
  removeFollowing,
  createFollow,
  ensureNotSelfFollowing,
  getFollow,
  getActors,
}
