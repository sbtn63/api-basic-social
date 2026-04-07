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
  return await models.Comment.create(data);
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
  getCommentReplies,
  getCommentUser,
  getParentComment
};
