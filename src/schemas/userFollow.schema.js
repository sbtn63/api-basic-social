const Joi = require("joi");

const userId = Joi.number().integer().positive();

const followActionSchema = Joi.object({
  userId: userId.required()
});

module.exports = {
  followActionSchema
};
