const Joi = require("joi");

const id = Joi.number().integer().positive();
const description = Joi.string().min(1).max(1000).empty('');
const imageUrl = Joi.string().uri().empty('');
const reactionId = Joi.number().integer().positive();

const savePostSchema = Joi.object({
  description,
  imageUrl
}).or('description', 'imageUrl');

const getPostSchema = Joi.object({
  id: id.required()
});

const reactionPostSchema = Joi.object({
  reactionId: reactionId.required()
});

const paginationPostSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
  savePostSchema,
  getPostSchema,
  reactionPostSchema,
  paginationPostSchema
};
