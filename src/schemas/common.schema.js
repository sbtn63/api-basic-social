const Joi = require("joi");

const id = Joi.number().integer().positive();

const itemIdSchema = Joi.object({
  id: id.required()
});

const paginationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
  paginationSchema,
  itemIdSchema
};
