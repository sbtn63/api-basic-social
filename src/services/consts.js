const { COMMENT_TABLE } = require("../db/models/comment.models");
const { POST_TABLE } = require("../db/models/post.models");
const { POST_REACTION_TABLE } = require("../db/models/postReactions.models");
const { REACTION_TABLE } = require("../db/models/reaction.models");
const { TYPE_NOTIFICATION_TABLE } = require("../db/models/typeNotifications.models");
const { USER_TABLE } = require("../db/models/user.models");
const { USER_FOLLOW_TABLE } = require("../db/models/userFollows.model");
const { USER_NOTIFICATION_TABLE } = require("../db/models/userNotifications.models");

const ACTIONS_AUDIT = Object.freeze({
  INSERT: "INSERT",
  UPDATE: "UPDATE",
  DELETE: "DELETE"
});

const TYPE_NOTIFICATION = Object.freeze({
  NEW_FOLLOWED : 1,
  POST_COMMENT: 2,
  NEW_POST: 3,
  POST_REACTION: 4,
  UPDATED_POST: 5,
  DELETED_POST: 6,
  RESPONSE_COMMENT: 7,
  EDIT_COMMENT: 8,
  DELETE_COMMENT: 9,
});

const TABLE_NAMES = Object.freeze({
  USER_TABLE,
  COMMENT_TABLE,
  POST_TABLE,
  POST_REACTION_TABLE,
  TYPE_NOTIFICATION_TABLE,
  USER_FOLLOW_TABLE,
  USER_NOTIFICATION_TABLE,
  REACTION_TABLE
});

const SERVICE_MESSAGES = Object.freeze({
  AUDIT_FAILED: "Audit log failed, continuing process:",
  NOTIFICATION_FAILED: "Insert User Notification failed, continuing process:",
  USER_NOT_FOUND: "User not found!!",
  USER_PROFILE: "User profile!!",
  EMAIL_VALIDATION_MESSAGE: "Email already in use. Please login instead",
  VALIDATION_ERROR: "Validation Error",
  REGISTER_USER: "User register successfully",
  CREDENTIALS_INVALID: "Credentials Invalid!!",
  LOGIN_USER: "User login successfully",
  FOLLOWER_NOT_FOUND: "Follower not found!!",
  FOLLOWED_NOT_FOUND: "Followed not found!!",
  FOLLOWING_CONFLICT: "The user can or can follow themselves",
  UNFOLLOW_CONFLICT: "The user can or can unfollow themselves",
  UNFOLLOW_SUCCESS: "The user unfollow success",
  UNFOLLOW_NOT_FOUND: "Follow not found",
  FOLLOWED_EXISTS: "user already followed!!",
  NEW_FOLLOWED_NOTIFICATION_MESAGGE: "A new user has followed you!!",
  NEW_FOLLOWED: "Followed success!!",
  USERS_SEARCH: "Users get success!!",
  USERS_SEARCH_NOT_FOUND: "No match users",
  POST_CREATE: "New Post Create Successfully!!",
  NEW_POST_NOTIFICATION_MESSAGE: "Post add successfully!!",
  POST_NOT_FOUND: "Post not found!!",
  POST_UPDATE: "Post Updated!!",
  POST_DELETE: "Post Delete Successfully!!"
});

module.exports = {
  ACTIONS_AUDIT,
  TYPE_NOTIFICATION,
  TABLE_NAMES,
  SERVICE_MESSAGES,
};
