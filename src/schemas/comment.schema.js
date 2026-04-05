const Joi = require("joi");

const content = Joi.string().min(1).max(1000).required();
const postId = Joi.number().integer().positive();
const parentCommentId = Joi.number().integer().positive();

const saveCommentSchema = Joi.object({
  content,
  postId: postId.required(),
  parentCommentId
});

const updateCommentSchema = Joi.object({
  content
});

module.exports = {
  saveCommentSchema,
  updateCommentSchema
};
