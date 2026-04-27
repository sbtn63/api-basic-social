import Joi from 'joi';

const id = Joi.number().integer().positive();
const firstName = Joi.string().min(3);
const lastName = Joi.string().min(3);
const avatarUrl = Joi.string().uri();
const newEmail = Joi.string().email();
const currentPassword = Joi.string().min(8);
const newPassword = Joi.string().min(8);
const confirmPassword = Joi.string();

const schemaGetUser = Joi.object({
  id: id.required()
});

const schemaGetUserFullName = Joi.object({
  fullname: Joi.string().min(3).required(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0)
});

const schemaUpdateProfile = Joi.object({
  firstName,
  lastName
}).or('description', 'imageUrl');

const schemaChangeAvatar = Joi.object({
  avatarUrl : avatarUrl.required()
});

const schemaChangeEmail = Joi.object({
  newEmail: newEmail.required()
});

const schemaChangePassword = Joi.object({
  currentPassword: oldPassword.required(),
  newPassword: newPassword.required(),
  confirmPassword: confirmPassword
      .required()
      .valid(Joi.ref('newPassword'))
      .messages({
        'any.only': 'Password not match'
      })
});

export {
  schemaGetUser,
  schemaGetUserFullName,
  schemaUpdateProfile,
  schemaChangeAvatar,
  schemaChangeEmail,
  schemaChangePassword
};
