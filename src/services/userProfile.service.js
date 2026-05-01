import { findUsersByFullNameByInfluence } from './userProfileQuery.service.js';
import ResponseSuccess from '../schemas/responseSuccess.schema.js';
import ResponseError from '../schemas/responseError.schema.js';
import { ACTIONS_AUDIT, SERVICE_MESSAGES, TABLE_NAMES } from './consts.js';
import { getUserByEmail, getUserById } from './user.service.js';
import { insertAuditLog } from './audit.service.js';
import { checkPassword, genHashSaltPassword } from '../libs/bcrypt.js';

const getUserByFullName = async(fullname, pagination) => {
  const users = await findUsersByFullNameByInfluence(fullname, pagination);
  if(!users || users.length === 0) {
    throw new ResponseError(SERVICE_MESSAGES.USERS_SEARCH_NOT_FOUND, 404);
  }

  return ResponseSuccess.success(SERVICE_MESSAGES.USERS_SEARCH, users, 200);
};

const updateUserProfile = async(data, userId) => {
  const user = await getUserById(userId);
  return await updateUser(data, user, SERVICE_MESSAGES.USER_PROFILE_UPDATE_SUCCESS);
};

const updateUserAvatar = async(data, userId) => {
  const user = await getUserById(userId);
  return await updateUser(data, user, SERVICE_MESSAGES.USER_AVATAR_UPDATE_SUCCESS);
};

const changeEmailUser = async(data, userId) => {
  const user = await getUserById(userId);
  if(await existsEmail(data.newEmail, user.email)) {
    throw new ResponseError(SERVICE_MESSAGES.EMAIL_EXISTS, 209);
  }
  return updateUser({email: data.newEmail}, user, SERVICE_MESSAGES.EMAIL_UPDATE_SUCCESS);
};

const existsEmail = async(newEmail, userEmail) => {
  const userByEmail = await getUserByEmail(newEmail);
  if(!userByEmail) return false;
  if(userByEmail && (newEmail === userEmail)) return false;
  return true;
};

const changePasswordUser = async(data, userId) => {
  const user = await getUserById(userId);
  const userByEMail = await getUserByEmail(user.email);
  const isValidPassword = await checkPassword(data.currentPassword, userByEMail.passwordHash);
  if (!isValidPassword) throw new ResponseError(SERVICE_MESSAGES.CREDENTIALS_INVALID, 400);
  const passwordHash = await genHashSaltPassword(data.newPassword);
  return updateUser({passwordHash}, user, SERVICE_MESSAGES.PASSWORD_CHANGE_SUCCESS);
};

const updateUser = async(data, user, message) => {
  const oldUser = user.toJSON();
  user.set(data);
  await user.save();

  const {passwordHash, ...userData} = user.toJSON();

  insertAuditLog({
    userId: user.id,
    action: ACTIONS_AUDIT.UPDATE,
    tableName: TABLE_NAMES.USER_TABLE,
    recordId: user.id,
    oldData: oldUser,
    newData: userData
  });

  return ResponseSuccess.success(message, userData, 200);
};

export {
  getUserByFullName,
  updateUserAvatar,
  updateUserProfile,
  changeEmailUser,
  changePasswordUser
};
