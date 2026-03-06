const { models } = require("../libs/sequelize");
const { insertAuditLog } = require("./audit.service");
const { getPost } = require("./post.service");
const { insertUserNotification } = require("./userNotifications.service");
const { ACTIONS_AUDIT, TABLE_NAMES, SERVICE_MESSAGES, TYPE_NOTIFICATION } = require("./consts");
const ResponseSuccess = require("../schemas/responseSuccess.schema");
const ResponseError = require("../schemas/responseError.schema");

const toggleReaction = async (postId, userId, data) => {
  const reactionContext = await getReactionAndPostContext(data.reactionId, postId);
  const [postReactionInstance, isNewRecord] = await findOrCreatePostReaction(postId, userId, data.reactionId);

  if (isNewRecord) {
    return await processReactionAction(postReactionInstance, reactionContext, 'CREATE');
  }

  if (postReactionInstance.reactionId !== data.reactionId) {
    return await processReactionAction(postReactionInstance, reactionContext, 'UPDATE');
  }

  return await processReactionAction(postReactionInstance, reactionContext, 'DELETE');
};

const processReactionAction = async (postReactionInstance, reactionContext, actionType) => {
  let responseData = postReactionInstance;
  let statusCode = 200;
  let message = SERVICE_MESSAGES.NEW_POST_REACTION;

  const notificationData = {
    toUserId: reactionContext.post.userId,
    fromUserId: postReactionInstance.userId,
    typeNotificationId: TYPE_NOTIFICATION.POST_REACTION,
    postId: postReactionInstance.postId,
    message: SERVICE_MESSAGES.NEW_POST_REACTION_NOTIFICATION_MESSAGE
  };

  const auditData = {
    userId: postReactionInstance.userId,
    action: ACTIONS_AUDIT.INSERT,
    tableName: TABLE_NAMES.POST_REACTION_TABLE,
    recordId: postReactionInstance.postId,
    newData: null,
    oldData: null
  };

  switch (actionType) {
    case 'UPDATE':
      message = SERVICE_MESSAGES.SET_POST_REACTION;
      auditData.action = ACTIONS_AUDIT.UPDATE;
      auditData.oldData = postReactionInstance.toJSON();

      responseData = await updateReactionId(postReactionInstance, reactionContext.reaction.id);

      auditData.newData = responseData.toJSON();
      notificationData.message = SERVICE_MESSAGES.SET_POST_REACTION_NOTIFICATION_MESSAGE;

      insertUserNotification(notificationData);
      insertAuditLog(auditData);
      break;

    case 'DELETE':
      message = SERVICE_MESSAGES.DELETE_POST_REACTION;
      auditData.action = ACTIONS_AUDIT.DELETE;

      responseData = await removePostReaction(postReactionInstance);

      auditData.oldData = responseData;
      insertAuditLog(auditData);
      break;

    case 'CREATE':
    default:
      statusCode = 201;
      auditData.newData = postReactionInstance.toJSON();

      insertUserNotification(notificationData);
      insertAuditLog(auditData);
  }

  return ResponseSuccess.success(message, responseData, statusCode);
};

const updateReactionId = async (postReactionInstance, newReactionId) => {
  postReactionInstance.reactionId = newReactionId;
  return await postReactionInstance.save();
};

const removePostReaction = async (postReactionInstance) => {
  const deletedDataSnapshot = postReactionInstance.toJSON();
  await postReactionInstance.destroy();
  return deletedDataSnapshot;
};

const findOrCreatePostReaction = async (postId, userId, reactionId) => {
  return await models.PostReaction.findOrCreate({
    where: { userId, postId },
    defaults: { reactionId }
  });
};

const getReactionById = async (id) => {
  const reaction = await models.Reaction.findByPk(id);
  if (!reaction) throw new ResponseError(404, SERVICE_MESSAGES.REACTION_NOT_EXISTS);
  return reaction;
};

const getReactionAndPostContext = async (reactionId, postId) => {
  const reaction = await getReactionById(reactionId);
  const post = await getPost(postId);
  return { reaction, post };
};

module.exports = {
  toggleReaction,
  processReactionAction,
  updateReactionId,
  removePostReaction,
  findOrCreatePostReaction,
  getReactionAndPostContext,
  getReactionById
};
