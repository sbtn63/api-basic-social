const { insertAuditLog } = require("./audit.service");
const { insertUserNotification } = require("./userNotifications.service");
const { saveComment, getCommentUser, getParentComment } = require("./comment.service");
const { ACTIONS_AUDIT, TABLE_NAMES, SERVICE_MESSAGES, TYPE_NOTIFICATION } = require("./consts");
const ResponseSuccess = require("../schemas/responseSuccess.schema");
const { getPost } = require("./post.service");

const createComment = async (data, userId, postId) => {
  const targetEntity = data.parentCommentId
    ? await getParentComment(data.parentCommentId, postId)
    : await getPost(postId);

  const { message, type } = getNotificationMetadata(!!data.parentCommentId);
  const comment = await saveComment({...data, userId, postId});

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

const updateComment = async (data, userId, params) => {
  const { commentId, id } = params;
  const oldCommentUserToPost = await getCommentUser(commentId, id, userId);
  const comment = await saveComment({...data, userId}, commentId);

  await insertAuditLog({
    userId,
    action: ACTIONS_AUDIT.UPDATE,
    tableName: TABLE_NAMES.COMMENT_TABLE,
    recordId: updateComment.id,
    oldData: oldCommentUserToPost.toJSON(),
    newData: comment.toJSON()
  });

  return ResponseSuccess.success(
    SERVICE_MESSAGES.UPDATE_COMMENT_SUCCESS,
    comment,
    200
  );
};

const deleteComment = async (params, userId) => {
  const { commentId, id } = params;
  const commentUserToPost = await getCommentUser(commentId, id, userId);
  const deleteData = commentUserToPost.toJSON();
  await commentUserToPost.destroy();

  await insertAuditLog({
    userId,
    action: ACTIONS_AUDIT.DELETE,
    tableName: TABLE_NAMES.COMMENT_TABLE,
    recordId: updateComment.id,
    oldData: deleteData
  });

  return ResponseSuccess.success(
    SERVICE_MESSAGES.DELETE_COMMENT_SUCCESS,
    deleteData,
    200
  );
};

const getCommentsByPost = async (postId, pagination) => {

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

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPost
};
