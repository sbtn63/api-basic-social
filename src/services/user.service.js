const { models } = require("../libs/sequelize");
const { genHashSaltPassword } = require("../libs/bcrypt");
const ResponseSuccess = require("../schemas/responseSuccess.schema");
const ResponseError = require("../schemas/responseError.schema");
const { SERVICE_MESSAGES } = require("./consts");

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

const getUserByFullName = async(fullname) => {
  const users = await models.User.searchByFullName(fullname);
  if(!users || users.length === 0) {
    throw new ResponseError(SERVICE_MESSAGES.USERS_SEARCH_NOT_FOUND, 404);
  }

  return ResponseSuccess.success(SERVICE_MESSAGES.USERS_SEARCH, users, 200);
};

module.exports = {
  getUserByEmail,
  createUser,
  getUserProfile,
  getUserById,
  getUserByFullName
};
