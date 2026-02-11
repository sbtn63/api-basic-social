const { models } = require("../libs/sequelize");
const { SERVICE_MESSAGES, TYPE_NOTIFICATION } = require("./consts");
const { getUserById } = require("./user.service");
const { insertAuditLog } = require("./audit.service");
const { insertUserNotification } = require("./userNotifications.service");
const ResponseError = require("../schemas/responseError.schema");
const ResponseSuccess = require("../schemas/responseSuccess.schema");

const createFollow = async (follower, followed) => {
  const following = await models.UserFollows.create({
    followedId : followed.id,
    followerId: follower.id
  });

  return following;
}

const getFollow = async (follower, followed) => {
  const follow = await models.UserFollows.findOne({where: {
    followedId: followed.id,
    followerId: follower.id
  }});
  return follow;
};

const ensureNotSelfFollowing = (followerId, followedId, message) => {
  if (followerId === followedId) {
    throw new ResponseError(message, 409);
  }
};

const addFollowing = async (followerId, followedId) => {
  ensureNotSelfFollowing(followerId, followedId, SERVICE_MESSAGES.FOLLOWING_CONFLICT);

  const follower = await getUserById(followerId, SERVICE_MESSAGES.FOLLOWER_NOT_FOUND);
  const followed = await getUserById(followedId, SERVICE_MESSAGES.FOLLOWED_NOT_FOUND);

  const alreadyFollowing = await follower.hasFollowing(followed);
  if (alreadyFollowing) {
    return ResponseSuccess.success(SERVICE_MESSAGES.FOLLOWED_EXISTS, 200, {"followed": true});
  }

  const following = await createFollow(follower, followed);

  await insertAuditLog(follower.id, ACTIONS_AUDIT.INSERT, TABLE_NAMES.USER_FOLLOW_TABLE, followed.id, null, following.toJSON());

  await insertUserNotification(followed, follower, TYPE_NOTIFICATION.NEW_FOLLOWED, null, null, SERVICE_MESSAGES.NEW_FOLLOWED_NOTIFICATION_MESAGGE);

  return ResponseSuccess.success(SERVICE_MESSAGES.NEW_FOLLOWED, 201,{"followed": true});
};

const removeFollowing = async (followerId, followedId) => {
  ensureNotSelfFollowing(followerId, followedId, SERVICE_MESSAGES.UNFOLLOW_CONFLICT);

  const follower = await getUserById(followerId, SERVICE_MESSAGES.FOLLOWER_NOT_FOUND);
  const followed = await getUserById(followedId, SERVICE_MESSAGES.FOLLOWED_NOT_FOUND);

  const followRecord = await getFollow(follower, followed);
  if (!followRecord) {
    return ResponseSuccess.success(SERVICE_MESSAGES.UNFOLLOW_NOT_FOUND, 200, {"followed": false});
  }

  const deletedData = followRecord.toJSON();
  await followRecord.destroy();

  await insertAuditLog(follower.id, ACTIONS_AUDIT.DELETE, TABLE_NAMES.USER_FOLLOW_TABLE, followed.id, deletedData, null);

  return ResponseSuccess.success(SERVICE_MESSAGES.UNFOLLOW_SUCCESS, 200,{"followed": false});
};

module.exports = {
  addFollowing,
  removeFollowing,
}
