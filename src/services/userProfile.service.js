import { findUsersByFullNameByInfluence } from './userProfileQuery.service.js';
import ResponseSuccess from '../schemas/responseSuccess.schema.js';
import ResponseError from '../schemas/responseError.schema.js';
import { SERVICE_MESSAGES } from './consts.js';

const getUserByFullName = async(fullname, pagination) => {
  const users = await findUsersByFullNameByInfluence(fullname, pagination);
  if(!users || users.length === 0) {
    throw new ResponseError(SERVICE_MESSAGES.USERS_SEARCH_NOT_FOUND, 404);
  }

  return ResponseSuccess.success(SERVICE_MESSAGES.USERS_SEARCH, users, 200);
};

export {
  getUserByFullName
};
