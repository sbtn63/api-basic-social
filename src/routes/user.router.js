const express = require("express");

const {USER_ROUTES} = require("./consts");
const isAuth = require("../middleware/isAuth.middleware");
const { getUserProfile } = require("../services/user.service");
const { addFollowing, removeFollowing } = require("../services/userFollow.service");
const validatorHandler = require("../middleware/validatorHandler.middleware");
const { schemaGetUser } = require("../schemas/user.schema");


const router = express.Router();

// Ruta para verificacion de middleware auth
router.get(
  USER_ROUTES.ME,
  isAuth,
  async (req, res, next) =>
{
  try {
    const id = req.auth.sub;
    const result = await getUserProfile(id);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.post(
  USER_ROUTES.FOLLOW,
  isAuth,
  validatorHandler(schemaGetUser, 'params'),
  async (req, res, next) =>
{
  try{
    const followedId = req.params.id;
    const followerId = req.auth.sub;
    const result = await addFollowing(followerId, followedId);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.delete(
  USER_ROUTES.UNFOLLOW,
  isAuth,
  validatorHandler(schemaGetUser, 'params'),
  async (req, res, next) =>
{
  try{
    const followedId = req.params.id;
    const followerId = req.auth.sub;
    const result = await removeFollowing(followerId, followedId);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
