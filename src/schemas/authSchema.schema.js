const Joi = require("joi");

const firstName = Joi.string().min(3);
const lastName = Joi.string().min(3);
const email = Joi.string().email();
const password = Joi.string().min(8);
const confirmPassword = Joi.string();

const loginSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

const registerSchema = Joi.object({
  firstName,
  lastName,
  email: email.required(),
  password: password.required(),
  confirmPassword: confirmPassword
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Password not match'
    })
});

module.exports = {
  loginSchema,
  registerSchema,
};
