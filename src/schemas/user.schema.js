const Joi = require("joi");

const id = Joi.number().integer().positive();

const schemaGetUser = Joi.object({
  id: id.required()
});

module.exports = {
  schemaGetUser
};
