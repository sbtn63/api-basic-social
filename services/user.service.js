const { models } = require("../libs/sequelize");
const { genHashSaltPassword } = require("../libs/bcrypt");
const ResponseSuccess = require("../schemas/responseSuccess.schema");
const ResponseError = require("../schemas/responseError.schema");

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
  const user = await models.User.findByPk(id);
  if(!user) throw new ResponseError("User not found!!", 404);
  delete user.createAt;
  delete user.updatedAt;
  return ResponseSuccess.success("User profile!!", user, 200);
};

module.exports = {
  getUserByEmail,
  createUser,
  getUserProfile,
};
