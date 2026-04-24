import express from 'express';

import { POST_ROUTES } from './consts.js';
import isAuth from '../middleware/isAuth.middleware.js';
import { createPost, updatePost, deletePost, getPostReactions } from '../services/post.service.js';
import { createComment, updateComment, deleteComment, getParentCommentsByPost } from '../services/postComment.service.js';
import validatorHandler from '../middleware/validatorHandler.middleware.js';
import { savePostSchema, reactionPostSchema, commentPostSchema } from '../schemas/post.schema.js';
import { saveCommentSchema, updateCommentSchema } from '../schemas/comment.schema.js';
import { paginationSchema, itemIdSchema } from '../schemas/common.schema.js';
import { toggleReaction } from '../services/postReactions.service.js';


const router = express.Router();

router.post(
  POST_ROUTES.CREATE,
  isAuth,
  validatorHandler(savePostSchema, 'body'),
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const result = await createPost(req.body, userId);
  return res.sendResponse(result.status, result.message, result.data);
});

router.put(
  POST_ROUTES.UPDATE,
  isAuth,
  validatorHandler(savePostSchema, 'body'),
  validatorHandler(itemIdSchema, 'params'),
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const id = req.params.id;
  const result = await updatePost(req.body, userId, id);
  return res.sendResponse(result.status, result.message, result.data);
});

router.delete(
  POST_ROUTES.DELETE,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  async (req, res, next) =>
{
  const id = req.params.id;
  const userId = req.auth.sub;
  const result = await deletePost(id, userId);
  return res.sendResponse(result.status, result.message, result.data);
});

router.post(
  POST_ROUTES.REACTION,
  isAuth,
  validatorHandler(reactionPostSchema, 'body'),
  validatorHandler(itemIdSchema, 'params'),
  async (req, res, next) =>
{
  const id = req.params.id;
  const userId = req.auth.sub;
  const result = await toggleReaction(id, userId, req.body);
  return res.sendResponse(result.status, result.message, result.data);
});

router.get(
  POST_ROUTES.REACTION,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  validatorHandler(paginationSchema, 'query'),
  async (req, res, next) =>
{
  const id = req.params.id;
  const { limit, offset } = req.query;
  const result = await getPostReactions(id, {limit, offset});
  return res.sendResponse(result.status, result.message, result.data);
});

router.post(
  POST_ROUTES.CREATE_COMMENT,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  validatorHandler(saveCommentSchema, 'body'),
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const id = req.params.id;
  const result = await createComment(req.body, userId, id);
  return res.sendResponse(result.status, result.message, result.data);
});

router.put(
  POST_ROUTES.UPDATE_COMMENT,
  isAuth,
  validatorHandler(updateCommentSchema, 'body'),
  validatorHandler(commentPostSchema, 'params'),
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const { id, commentId} = req.params;
  const result = await updateComment(req.body, userId, {id, commentId});
  return res.sendResponse(result.status, result.message, result.data);
});

router.delete(
  POST_ROUTES.DELETE_COMMENT,
  isAuth,
  validatorHandler(commentPostSchema, 'params'),
  async (req, res, next) =>
{
  const {id, commentId } = req.params;
  const userId = req.auth.sub;
  const result = await deleteComment({id, commentId}, userId);
  return res.sendResponse(result.status, result.message, result.data);
});

router.get(
  POST_ROUTES.GET_COMMENTS,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  validatorHandler(paginationSchema, 'query'),
  async (req, res, next) =>
{
  const id = req.params.id;
  const { limit, offset } = req.query;
  const result = await getParentCommentsByPost(id, {limit, offset});
  return res.sendResponse(result.status, result.message, result.data);
});

export default router;
