const { models } = require("../libs/sequelize");
const { genHashSaltPassword } = require("../libs/bcrypt");

const getUserByEmail = async (email) => {
  return await models.User.findOne({
    where: { email }
  });
};

const createUser = async (data) => {
  data.password = await genHashSaltPassword(data.password);
  return await models.User.create(data);
};

module.exports = {
  getUserByEmail,
  createUser
};
