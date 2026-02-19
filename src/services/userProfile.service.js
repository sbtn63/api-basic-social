const { findUsersByFullNameByInfluence } = require("./userProfileQuery.service");
const ResponseSuccess = require("../schemas/responseSuccess.schema");
const ResponseError = require("../schemas/responseError.schema");
const { SERVICE_MESSAGES } = require("./consts");

const getUserByFullName = async(fullname, pagination) => {
  const users = await findUsersByFullNameByInfluence(fullname, pagination);
  if(!users || users.length === 0) {
    throw new ResponseError(SERVICE_MESSAGES.USERS_SEARCH_NOT_FOUND, 404);
  }

  return ResponseSuccess.success(SERVICE_MESSAGES.USERS_SEARCH, users, 200);
};

module.exports = {
  getUserByFullName
};
