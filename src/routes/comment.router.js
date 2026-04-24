import express from 'express';

import { COMMENT_ROUTES } from './consts.js';
import isAuth from '../middleware/isAuth.middleware.js';
import validatorHandler from '../middleware/validatorHandler.middleware.js';
import { getCommentReplies } from '../services/comment.service.js';
import { paginationSchema, itemIdSchema } from '../schemas/common.schema.js';


const router = express.Router();

router.get(
  COMMENT_ROUTES.REPLIES,
  isAuth,
  validatorHandler(itemIdSchema, 'params'),
  validatorHandler(paginationSchema, 'query'),
  async (req, res, next) =>
{
  const id = req.params.id;
  const { limit, offset } = req.query;
  const result = await getCommentReplies(id, {limit, offset});
  return res.sendResponse(result.status, result.message, result.data);
});

export default router;
