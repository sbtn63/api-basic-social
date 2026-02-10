const { models } = require("../libs/sequelize");
const { SERVICE_MESSAGES, TYPE_NOTIFICATION } = require("./consts");
const { getUserById } = require("./user.service");
const { insertAuditLog } = require("./audit.service");
const { insertUserNotification } = require("./userNotifications.service");
const ResponseError = require("../schemas/responseError.schema");
const ResponseSuccess = require("../schemas/responseSuccess.schema");

const createFollows = async (follower, followed) => {
  const following = await models.UserFollows.create({
    followedId : followed.id,
    followerId: follower.id
  });

  return following;
}

const addFollowing = async (followerId, followedId) => {
  if(followerId === followedId) {
    throw new ResponseError(SERVICE_MESSAGES.FOLLOWING_CONFLICT, 409);
  }

  const follower = await getUserById(followerId, SERVICE_MESSAGES.FOLLOWER_NOT_FOUND);
  const followed = await getUserById(followedId, SERVICE_MESSAGES.FOLLOWED_NOT_FOUND);

  if(await follower.hasFollowing(followed)){
    return ResponseSuccess.success(SERVICE_MESSAGES.FOLLOWED_EXISTS, 200, {"followed": true});
  }

  const following = await createFollows(follower, followed);
  await insertAuditLog(
    follower.id,
    ACTIONS_AUDIT.INSERT,
    TABLE_NAMES.USER_FOLLOW_TABLE,
    followed.id,
    null,
    following.toJSON()
  );

  await insertUserNotification(
    followed,
    follower,
    TYPE_NOTIFICATION.NEW_FOLLOWED,
    null,
    null,
    SERVICE_MESSAGES.NEW_FOLLOWED_NOTIFICATION_MESAGGE
  );

  return ResponseSuccess.success(SERVICE_MESSAGES.NEW_FOLLOWED,201,{"followed": true});
};
