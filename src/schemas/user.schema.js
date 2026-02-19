const Joi = require("joi");

const id = Joi.number().integer().positive();

const schemaGetUser = Joi.object({
  id: id.required()
});

const schemaGetUserFullName = Joi.object({
  fullname: Joi.string().min(3).required(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
  schemaGetUser,
  schemaGetUserFullName,
};
