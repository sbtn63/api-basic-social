const Joi = require("joi");

const content = Joi.string().min(1).max(1000).required();
const parentCommentId = Joi.number().integer().positive();

const saveCommentSchema = Joi.object({
  content,
  parentCommentId
});

const updateCommentSchema = Joi.object({
  content
});

module.exports = {
  saveCommentSchema,
  updateCommentSchema
};
