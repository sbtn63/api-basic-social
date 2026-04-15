const { models } = require("../libs/sequelize");
const { SERVICE_MESSAGES } = require("./consts");
const ResponseError = require("../schemas/responseError.schema");
const { findAllRecentComments } = require("./postCommentQuery.service");
const ResponseSuccess = require("../schemas/responseSuccess.schema");


const getCommentReplies = async (commentId, pagination) => {
  const comment = await getComment(commentId);
  const replies = await findAllRecentComments({parentCommentId: comment.id}, pagination);
  return ResponseSuccess.success(SERVICE_MESSAGES.REPLIESCOMMENT_SUCCESS, replies, 200);
};

const saveComment = async (data, id = null) => {
  if(id) {
    await models.Comment.update(
      {content: data.content},
      {where: {id}}
    );
    return getComment(id);
  }
  data.parentCommentId ??= null;
  return await models.Comment.create(data);
};

const findCommentBy = async (
  whereClause,
  message=SERVICE_MESSAGES.COMMENT_NOT_FOUND,
  status=404
) => {
  const comment = await models.Comment.findOne({ where: whereClause });
  validateComment(comment, message, status);
  return comment;
};

const getCommentUser = (id, postId, userId) => {
  return findCommentBy({ id, postId, userId }, SERVICE_MESSAGES.COMMENT_NOT_POST_USER, 403);
};

const getParentComment = (id, postId) => {
  return findCommentBy({ id, postId }, SERVICE_MESSAGES.PARENTCOMMENT_NOT_FOUND);
};

const getComment = (id) => findCommentBy({ id });

const validateComment = (comment, message, status) => {
  if (!comment) {
    throw new ResponseError(message, status);
  }
};

module.exports = {
  saveComment,
  getCommentReplies,
  getCommentUser,
  getParentComment
};
