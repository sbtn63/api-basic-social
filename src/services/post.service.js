const { models } = require("../libs/sequelize");
const { insertAuditLog } = require("./audit.service");
const { insertUserNotification } = require("./userNotifications.service");
const { ACTIONS_AUDIT, TABLE_NAMES, SERVICE_MESSAGES, TYPE_NOTIFICATION } = require("./consts");
const ResponseSuccess = require("../schemas/responseSuccess.schema");
const ResponseError = require("../schemas/responseError.schema");
const { findAllRecentReactionsPost } = require("./postReactionQuery.service");

const createPost = async (data, userId) => {
  const newPost = await savePost(data, userId);

  await insertUserNotification({
    toUserId: userId,
    fromUserId: userId,
    typeNotificationId: TYPE_NOTIFICATION.NEW_POST,
    postId: newPost.id,
    message: SERVICE_MESSAGES.NEW_POST_NOTIFICATION_MESSAGE
  });

  await insertAuditLog({
    userId,
    action: ACTIONS_AUDIT.INSERT,
    tableName: TABLE_NAMES.POST_TABLE,
    recordId: newPost.id,
    newData: newPost.toJSON()
  });

  const { created_at, updated_at, ...cleanData } = newPost.toJSON();
  return ResponseSuccess.success(SERVICE_MESSAGES.POST_CREATE, cleanData, 201);
};

const updatePost = async (data, userId, postId) => {
  const oldPost = await getPostUser(postId, userId);
  const post = await savePost(data, userId, postId);

  await insertAuditLog({
    userId,
    action: ACTIONS_AUDIT.UPDATE,
    tableName: TABLE_NAMES.POST_TABLE,
    recordId: post.id,
    oldData: oldPost.toJSON(),
    newData: post.toJSON()
  });

  return ResponseSuccess.success(SERVICE_MESSAGES.POST_UPDATE, post, 200);
};

const deletePost = async(postId, userId) => {
  const post = await getPostUser(postId, userId);
  const deleteData = post.toJSON()
  await post.destroy();

  await insertAuditLog({
    userId,
    action: ACTIONS_AUDIT.DELETE,
    tableName: TABLE_NAMES.POST_TABLE,
    recordId: deleteData.id,
    oldData: deleteData,
  });

  return ResponseSuccess.success(SERVICE_MESSAGES.POST_DELETE, deleteData, 200);
};

const getPostReactions = async(id, pagination) => {
  const post = await getPost(id);
  const infoReactionsPost = await findAllRecentReactionsPost(post.id, pagination);
  return ResponseSuccess.success(SERVICE_MESSAGES.REACTIONS_POST_LIST, infoReactionsPost, 200);
};

const savePost = async (data, userId, id = null) => {
  const postData = {
    description: data.description ?? null,
    imageUrl: data.imageUrl ?? null,
    userId
  };

  if(id){
    await models.Post.update(postData, { where: {id} });
    return await getPost(id);
  }
  return await models.Post.create(postData);
};

const getPostUser = async(postId, userId) => {
  const post = await models.Post.findOne({where: {
    id: postId,
    userId
  }});

  validatePost(post);
  return post;
};

const getPost = async(id) => {
  const post = await models.Post.findByPk(id);
  validatePost(post);
  return post;
};

const validatePost = (post) => {
  if(!post){
    throw new ResponseError(SERVICE_MESSAGES.POST_NOT_FOUND, 404);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  savePost,
  getPostUser,
  getPost,
  getPostReactions
};
