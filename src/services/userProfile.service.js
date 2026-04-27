import { findUsersByFullNameByInfluence } from './userProfileQuery.service.js';
import ResponseSuccess from '../schemas/responseSuccess.schema.js';
import ResponseError from '../schemas/responseError.schema.js';
import { ACTIONS_AUDIT, SERVICE_MESSAGES, TABLE_NAMES } from './consts.js';
import { getUserByEmail, getUserById } from './user.service.js';
import { insertAuditLog } from './audit.service.js';
import { use } from 'react';
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
  const userByEmail = await getUserByEmail(data.newEmail);

  if(userByEmail && (user.email !== data.newData)) {
    throw new ResponseError(SERVICE_MESSAGES.EMAIL_EXISTS, 209);
  }

  return updateUser({email: newEmail}, user, SERVICE_MESSAGES.EMAIL_UPDATE_SUCCESS);
};

const changePasswordUser = async(data, userId) => {
  const user = await getUserById(userId);
  const isValidPassword = await checkPassword(data.currentPassword, user.passwordHash);
  if (!isValidPassword) throw new ResponseError(SERVICE_MESSAGES.CREDENTIALS_INVALID, 400);
  const passwordHash = await genHashSaltPassword(data.newPassword);
  return updateUser({passwordHash}, user, SERVICE_MESSAGES.PASSWORD_CHANGE_SUCCESS);
};

const updateUser = async(data, user, message) => {
  const {passwordHash, ...oldUser} = user.toJSON();
  user.set(data);
  await user.save();

  insertAuditLog({
    userId: user.id,
    action: ACTIONS_AUDIT.UPDATE,
    tableName: TABLE_NAMES.USER_TABLE,
    recordId: user.id,
    oldData: oldUser,
    newData: user.toJSON()
  });

  return ResponseSuccess.success(message, user, 200);
};

export {
  getUserByFullName,
  updateUserAvatar,
  updateUserProfile,
  changeEmailUser,
  changePasswordUser
};
