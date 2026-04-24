import express from 'express';

import { USER_ROUTES } from './consts.js';
import isAuth from '../middleware/isAuth.middleware.js';
import { getUserProfile } from '../services/user.service.js';
import { getUserByFullName } from '../services/userProfile.service.js';
import { addFollowing, removeFollowing } from '../services/userFollow.service.js';
import validatorHandler from '../middleware/validatorHandler.middleware.js';
import { schemaGetUser, schemaGetUserFullName } from '../schemas/user.schema.js';


const router = express.Router();

// Ruta para verificacion de middleware auth
router.get(
  USER_ROUTES.ME,
  isAuth,
  async (req, res, next) =>
{
  const id = req.auth.sub;
  const result = await getUserProfile(id);
  return res.sendResponse(result.status, result.message, result.data);
});

router.get(
  USER_ROUTES.USERS_FILTER,
  isAuth,
  validatorHandler(schemaGetUserFullName, 'query'),
  async (req, res, next) =>
{
  const { fullname, limit, offset }= req.query;
  const result = await getUserByFullName(fullname, {limit, offset});
  return res.sendResponse(result.status, result.message, result.data);
});

router.post(
  USER_ROUTES.FOLLOW,
  isAuth,
  validatorHandler(schemaGetUser, 'params'),
  async (req, res, next) =>
{
  const followedId = req.params.id;
  const followerId = req.auth.sub;
  const result = await addFollowing(followerId, followedId);
  return res.sendResponse(result.status, result.message, result.data);
});

router.delete(
  USER_ROUTES.UNFOLLOW,
  isAuth,
  validatorHandler(schemaGetUser, 'params'),
  async (req, res, next) =>
{
  const followedId = req.params.id;
  const followerId = req.auth.sub;
  const result = await removeFollowing(followerId, followedId);
  return res.sendResponse(result.status, result.message, result.data);
});

export default router;
