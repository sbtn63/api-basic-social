const Joi = require("joi");

const id = Joi.number().integer().positive();
const content = Joi.string().min(1).max(1000).required();
const postId = Joi.number().integer().positive();
const parentId = Joi.number().integer().positive();

const saveCommentSchema = Joi.object({
  content,
  postId: postId.required(),
  parentId
});

const updateCommentSchema = Joi.object({
  content
});

module.exports = {
  saveCommentSchema,
  updateCommentSchema
};
