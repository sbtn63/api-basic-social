const { object } = require("joi");
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

module.exports = {
  ACTIONS_AUDIT,
  TYPE_NOTIFICATION,
  TABLE_NAMES,
}
