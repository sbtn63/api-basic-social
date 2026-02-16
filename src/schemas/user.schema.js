const Joi = require("joi");

const id = Joi.number().integer().positive();

const schemaGetUser = Joi.object({
  id: id.required()
});

const schemaGetUserFullName = Joi.object({
  fullname: Joi.string().min(3).required()
});

module.exports = {
  schemaGetUser,
  schemaGetUserFullName,
};
