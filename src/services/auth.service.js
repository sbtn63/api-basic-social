import generateJwt from '../libs/jwt.js';
import config from '../config/index.cjs';
import { insertAuditLog } from './audit.service.js';
import { ACTIONS_AUDIT, TABLE_NAMES, SERVICE_MESSAGES } from './consts.js';
import { checkPassword } from '../libs/bcrypt.js';
import ResponseSuccess from '../schemas/responseSuccess.schema.js';
import ResponseError from '../schemas/responseError.schema.js';
import { getUserByEmail, createUser, getUserById } from '../services/user.service.js';
import { addEmailVerification, getEmailVerification, invalidateEmailVerification, getActiveEmailVerification, changeIsUsed } from '../services/emailVerification.service.js';
import { sendVerificationEmail } from '../libs/brevo.js';

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

const requestVerifiedEmail = async (userId) => {
  const user = await getUserById(userId);
  if(user.isVerified) {
    throw new ResponseError(SERVICE_MESSAGES.USER_EMAIL_VERIFIED, 400);
  }

  const verificationInstance = await getActiveEmailVerification(user.email);
  if (verificationInstance) {
    const expireEmailVerification = await invalidateEmailVerification(verificationInstance);
    await insertAuditLog({
      userId: userId,
      action: ACTIONS_AUDIT.UPDATE,
      tableName: TABLE_NAMES.EMAIL_VEREFICATION_TABLE,
      recordId: expireEmailVerification.id,
      newData: expireEmailVerification.toJSON(),
      oldData: verificationInstance.toJSON()
    });
  }

  const emailVerification = await addEmailVerification(user.email);

  await insertAuditLog({
    userId: userId,
    action: ACTIONS_AUDIT.INSERT,
    tableName: TABLE_NAMES.EMAIL_VEREFICATION_TABLE,
    recordId: emailVerification.id,
    newData: emailVerification.toJSON()
  });

  await sendVerificationEmail(user.email, {
    USERNAME: `${user.firstName} ${user.lastName}`,
    MESSAGE: `El codigo expira en ${config.expiresCodeOTPMinutes} minutos`,
    CODE_OTP: emailVerification.code
  });

  return ResponseSuccess.success(
    SERVICE_MESSAGES.SEND_EMAIL_SUCCESS,
    {expiresAt: emailVerification.expiresAt},
    200
  );
};

const verifyEmail = async (code, userId) => {
  const user = await getUserById(userId);
  const emailVerification = await getEmailVerification(user.email, code);
  if(!emailVerification) {
    throw new ResponseError(SERVICE_MESSAGES.INVALID_CODE_EMAIL_VERIFICATION, 400);
  }

  const oldDataEmailVerification = emailVerification.toJSON();
  const inUsedCodeEmailVerification = await changeIsUsed(emailVerification);
  await insertAuditLog({
    userId: userId,
    action: ACTIONS_AUDIT.UPDATE,
    tableName: TABLE_NAMES.EMAIL_VEREFICATION_TABLE,
    recordId: inUsedCodeEmailVerification.id,
    newData: inUsedCodeEmailVerification.toJSON(),
    oldData: oldDataEmailVerification
  });

  const oldDataUser = user.toJSON();
  user.isVerified = true;
  user.emailVerifiedAt = new Date()
  await user.save();

  await insertAuditLog({
    userId: user.id,
    action: ACTIONS_AUDIT.UPDATE,
    tableName: TABLE_NAMES.USER_TABLE,
    recordId: user.id,
    newData: user.toJSON(),
    oldData: oldDataUser
  });

  return ResponseSuccess.success(
    SERVICE_MESSAGES.EMAIL_VERIFY_SUCCESS,
    user,
    200
  );
};

export {
  loginUser,
  registerUser,
  requestVerifiedEmail,
  verifyEmail
};
