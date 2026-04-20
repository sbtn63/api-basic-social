import { models } from '../libs/sequelize.js';
import { genHashSaltPassword } from '../libs/bcrypt.js';
import ResponseSuccess from '../schemas/responseSuccess.schema.js';
import ResponseError from '../schemas/responseError.schema.js';
import { SERVICE_MESSAGES, USER_PUBLIC_PROFILE_COLUMNS } from './consts.js';

const getUserByEmail = async (email) => {
  return await models.User.unscoped().findOne({
    where: { email }
  });
};

const createUser = async (data) => {
  const passwordHash = await genHashSaltPassword(data.password);
  const userData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    lastConnection: new Date(),
    passwordHash
  };
  return await models.User.create(userData);
};

const getUserProfile = async (id) => {
  const user = await getUserById(id, SERVICE_MESSAGES.USER_NOT_FOUND);
  return ResponseSuccess.success(SERVICE_MESSAGES.USER_PROFILE, user, 200);
};

const getUserById = async (id, message) => {
  const user = await models.User.findByPk(id);
  if(!user) {
    throw new ResponseError(message, 404);
  }
  return user;
};

const userInclude = () => ({
  model: models.User,
  as: 'user',
  attributes: USER_PUBLIC_PROFILE_COLUMNS
});

export {
  getUserByEmail,
  createUser,
  getUserProfile,
  getUserById,
  userInclude
};
