const { models } = require("../libs/sequelize");
const { insertAuditLog } = require("./audit.service");
const { insertUserNotification } = require("./userNotifications.service");
const { ACTIONS_AUDIT, TABLE_NAMES, SERVICE_MESSAGES, TYPE_NOTIFICATION } = require("./consts");
const ResponseSuccess = require("../schemas/responseSuccess.schema");
const ResponseError = require("../schemas/responseError.schema");
const { getPost } = require("./post.service");

const createComment = async (data, userId) => {
  const targetEntity = data.parentCommentId
    ? await getParentComment(data.parentCommentId, data.postId)
    : await getPost(data.postId);

  const { message, type } = getNotificationMetadata(!!data.parentCommentId);
  const comment = await saveComment(data, userId);

  await insertUserNotification({
    toUserId: targetEntity.userId,
    fromUserId: userId,
    typeNotificationId: type,
    postId: data.postId,
    commentId: data.parentCommentId,
    message: message
  });

  await insertAuditLog({
    userId,
    action: ACTIONS_AUDIT.INSERT,
    tableName: TABLE_NAMES.COMMENT_TABLE,
    recordId: comment.id,
    newData: comment.toJSON()
  });

  const { created_at, updated_at, ...cleanData } = comment.toJSON();
  return ResponseSuccess.success(SERVICE_MESSAGES.SAVE_COMMENT_SUCCESS, cleanData, 201);
};

const updateComment = async (data, userId, postId) => {

};

const deleteComment = async (commentId, userId) => {

};

const getCommentReplies = async (commentId, pagination) => {

};

const getCommentsByPost = async (postId, pagination) => {

};


const saveComment = async (data, userId, id = null) => {
  if(id) {
    await models.Comment.update(
      {content: data.content},
      {where: {id}}
    );
    return getComment(id);
  }
  return await models.Comment.create({...data, userId});
};

const getNotificationMetadata = (isResponse) => {
  return {
    message: isResponse
      ? SERVICE_MESSAGES.RESPONSE_POST_COMMENT_NOTIFICATION_MESSAGE
      : SERVICE_MESSAGES.NEW_POST_COMMENT_NOTIFICATION_MESSAGE,
    type: isResponse
      ? TYPE_NOTIFICATION.RESPONSE_COMMENT
      : TYPE_NOTIFICATION.POST_COMMENT
  };
};

const findCommentBy = async (whereClause, message = SERVICE_MESSAGES.COMMENT_NOT_FOUND) => {
  const comment = await models.Comment.findOne({ where: whereClause });
  validateComment(comment, message);
  return comment;
};

const getCommentUser = (id, postId, userId) => findCommentBy({ id, postId, userId });

const getParentComment = (id, postId) => findCommentBy({ id, postId });

const getComment = (id) => findCommentBy({ id });

const validateComment = (comment, message) => {
  if (!comment) {
    throw new ResponseError(message, 404);
  }
};


module.exports = {
  saveComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentReplies,
  getCommentsByPost
};
