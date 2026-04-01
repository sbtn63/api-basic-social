const express = require("express");

const {POST_ROUTES} = require("./consts");
const isAuth = require("../middleware/isAuth.middleware");
const { createPost, updatePost, deletePost, getPostReactions } = require("../services/post.service");
const validatorHandler = require("../middleware/validatorHandler.middleware");
const { savePostSchema, reactionPostSchema } = require("../schemas/post.schema");
const { paginationSchema, itemIdSchema } = require("../schemas/common.schema");
const { getCommentsByPost } = require("../services/comment.service");
const { toggleReaction } = require("../services/postReactions.service");


const router = express.Router();

router.post(
  POST_ROUTES.CREATE,
  isAuth,
  validatorHandler(savePostSchema, 'body'),
  async (req, res, next) =>
{
  try {
    const userId = req.auth.sub;
    const result = await createPost(req.body, userId);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.put(
  POST_ROUTES.UPDATE,
  isAuth,
  validatorHandler(savePostSchema, 'body'),
  validatorHandler(itemIdSchema, 'params'),
  async (req, res, next) =>
{
  try {
    const userId = req.auth.sub;
    const id = req.params.id;
    const result = await updatePost(req.body, userId, id);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.delete(
  POST_ROUTES.DELETE,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  async (req, res, next) =>
{
  try{
    const id = req.params.id;
    const userId = req.auth.sub;
    const result = await deletePost(id, userId);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.post(
  POST_ROUTES.REACTION,
  isAuth,
  validatorHandler(reactionPostSchema, 'body'),
  validatorHandler(itemIdSchema, 'params'),
  async (req, res, next) =>
{
  try{
    const id = req.params.id;
    const userId = req.auth.sub;
    const result = await toggleReaction(id, userId, req.body);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.get(
  POST_ROUTES.REACTION,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  validatorHandler(paginationSchema, 'query'),
  async (req, res, next) =>
{
  try{
    const id = req.params.id;
    const { limit, offset } = req.query;
    const result = await getPostReactions(id, {limit, offset});
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.get(
  POST_ROUTES.GET_COMMENTS,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  validatorHandler(paginationSchema, 'query'),
  async (req, res, next) =>
{
  try{
    const id = req.params.id;
    const { limit, offset } = req.query;
    const result = await getCommentsByPost(id, {limit, offset});
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
