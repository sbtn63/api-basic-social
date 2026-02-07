const { models } = require("../libs/sequelize");
const generateJwt = require("../libs/jwt");
const { insertAuditLog } = require("./audit.service");
const { ACTIONS_AUDIT, TABLE_NAMES } = require("./consts");
const { checkPassword } = require("../libs/bcrypt");
const ResponseSuccess = require("../schemas/responseSuccess.schema");
const ResponseError = require("../schemas/responseError.schema");
const { getUserByEmail, createUser } = require("../services/user.service");

const registerUser = async (body) => {
  const user = await getUserByEmail(body.email);
  if (user) {
    throw new ResponseError(
      "Validation Error",
      400,
      {email: "Email already in use. Please login instead"}
    );
  }

  const newUser = await createUser(body);
  const token = generateJwt(newUser.id);
  const { passwordHash, ...userData } = newUser.toJSON();

  await insertAuditLog(
    newUser.id,
    ACTIONS_AUDIT.INSERT,
    TABLE_NAMES.USER_TABLE,
    newUser.id,
    null,
    userData
  );

  return ResponseSuccess.success("User register successfully", {token}, 201);
};

const loginUser = async (body) => {
  const user = await getUserByEmail(body.email);
  if (!user) throw new ResponseError("Credentials Invalid!!", 400);

  const isCheckPassword = await checkPassword(body.password, user.passwordHash);
  if (!isCheckPassword) throw new ResponseError("Credentials Invalid!!", 400);

  await user.update({ lastConnection: new Date() });

  const token = generateJwt(user.id);
  return ResponseSuccess.success("User login successfully", {token}, 200);
};

module.exports = {
  loginUser,
  registerUser,
};
