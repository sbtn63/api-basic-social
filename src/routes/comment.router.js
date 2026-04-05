const express = require("express");

const {COMMENT_ROUTES} = require("./consts");
const isAuth = require("../middleware/isAuth.middleware");
const validatorHandler = require("../middleware/validatorHandler.middleware");
const { createComment, updateComment, deleteComment, getCommentReplies } = require("../services/comment.service");
const { saveCommentSchema, updateCommentSchema } = require("../schemas/comment.schema");
const { paginationSchema, itemIdSchema } = require("../schemas/common.schema");


const router = express.Router();

router.post(
  COMMENT_ROUTES.CREATE,
  isAuth,
  validatorHandler(saveCommentSchema, 'body'),
  async (req, res, next) =>
{
  try {
    const userId = req.auth.sub;
    const result = await createComment(req.body, userId);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
    console.log(error);
  }
});

router.put(
  COMMENT_ROUTES.UPDATE,
  isAuth,
  validatorHandler(updateCommentSchema, 'body'),
  validatorHandler(itemIdSchema, 'params'),
  async (req, res, next) =>
{
  try {
    const userId = req.auth.sub;
    const postId = req.params.id;
    const result = await updateComment(req.body, userId, postId);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.delete(
  COMMENT_ROUTES.DELETE,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  async (req, res, next) =>
{
  try{
    const id = req.params.id;
    const userId = req.auth.sub;
    const result = await deleteComment(id, userId);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.get(
  COMMENT_ROUTES.REPLIES,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  validatorHandler(paginationSchema, 'query'),
  async (req, res, next) =>
{
  try{
    const id = req.params.id;
    const { limit, offset } = req.query;
    const result = await getCommentReplies(id, userId, {limit, offset});
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
