const express = require("express");

const {COMMENT_ROUTES} = require("./consts");
const isAuth = require("../middleware/isAuth.middleware");
const validatorHandler = require("../middleware/validatorHandler.middleware");
const { getCommentReplies } = require("../services/comment.service");
const { paginationSchema, itemIdSchema } = require("../schemas/common.schema");


const router = express.Router();

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
