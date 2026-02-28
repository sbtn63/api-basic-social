const Joi = require("joi");

const id = Joi.number().integer().positive();
const description = Joi.string().min(1).max(1000).empty('');
const imageUrl = Joi.string().uri().empty('');

const savePostSchema = Joi.object({
  description,
  imageUrl
}).or('description', 'imageUrl');

const getPostSchema = Joi.object({
  id: id.required()
});

module.exports = {
  savePostSchema,
  getPostSchema
};
