const { models } = require("../libs/sequelize");
const generateJwt = require("../libs/jwt");
const { insertAuditLog } = require("./audit.service");
const { ACTIONS_AUDIT, TABLE_NAMES, SERVICE_MESSAGES } = require("./consts");
const { checkPassword } = require("../libs/bcrypt");
const ResponseSuccess = require("../schemas/responseSuccess.schema");
const ResponseError = require("../schemas/responseError.schema");
const { getUserByEmail, createUser } = require("../services/user.service");

const registerUser = async (body) => {
  const user = await getUserByEmail(body.email);
  if (user) {
    throw new ResponseError(
      SERVICE_MESSAGES.VALIDATION_ERROR,
      400,
      {email: SERVICE_MESSAGES.EMAIL_VALIDATION_MESSAGE}
    );
  }

  const newUser = await createUser(body);
  const token = generateJwt(newUser.id);
  const { passwordHash, ...userData } = newUser.toJSON();

  await insertAuditLog({
    userId: newUser.id,
    action: ACTIONS_AUDIT.INSERT,
    tableName: TABLE_NAMES.USER_TABLE,
    recordId: newUser.id,
    newData: userData
  });

  return ResponseSuccess.success(SERVICE_MESSAGES.REGISTER_USER, {token}, 201);
};

const loginUser = async (body) => {
  const user = await getUserByEmail(body.email);
  if (!user) throw new ResponseError(SERVICE_MESSAGES.CREDENTIALS_INVALID, 400);

  const isCheckPassword = await checkPassword(body.password, user.passwordHash);
  if (!isCheckPassword) throw new ResponseError(SERVICE_MESSAGES.CREDENTIALS_INVALID, 400);

  await user.update({ lastConnection: new Date() });

  const token = generateJwt(user.id);
  return ResponseSuccess.success(SERVICE_MESSAGES.LOGIN_USER, {token}, 200);
};

module.exports = {
  loginUser,
  registerUser,
};
