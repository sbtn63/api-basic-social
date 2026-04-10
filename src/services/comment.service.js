const { models } = require("../libs/sequelize");
const { SERVICE_MESSAGES } = require("./consts");
const ResponseError = require("../schemas/responseError.schema");


const getCommentReplies = async (commentId, pagination) => {

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

const findCommentBy = async (whereClause, message = SERVICE_MESSAGES.COMMENT_NOT_FOUND) => {
  const comment = await models.Comment.findOne({ where: whereClause });
  validateComment(comment, message);
  return comment;
};

const getCommentUser = (id, postId, userId) => {
  return findCommentBy({ id, postId, userId }, SERVICE_MESSAGES.COMMENT_NOT_POST_USER);
};
const getParentComment = (id, postId) => {
  return findCommentBy({ id, postId }, SERVICE_MESSAGES.PARENTCOMMENT_NOT_FOUND);
};

const getComment = (id) => findCommentBy({ id });

const validateComment = (comment, message) => {
  if (!comment) {
    throw new ResponseError(message, 404);
  }
};


module.exports = {
  saveComment,
  getCommentReplies,
  getCommentUser,
  getParentComment
};
