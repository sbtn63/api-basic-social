import express from 'express';

import { USER_ROUTES } from './consts.js';
import isAuth from '../middleware/isAuth.middleware.js';
import { getUserProfile } from '../services/user.service.js';
import { getUserByFullName, updateUserAvatar, updateUserProfile, changeEmailUser, changePasswordUser } from '../services/userProfile.service.js';
import { addFollowing, removeFollowing } from '../services/userFollow.service.js';
import validatorHandler from '../middleware/validatorHandler.middleware.js';
import { schemaChangeAvatar, schemaChangeEmail, schemaChangePassword, schemaGetUser, schemaGetUserFullName, schemaUpdateProfile } from '../schemas/user.schema.js';


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

router.patch(
  USER_ROUTES.CHANGE_PROFILE,
  isAuth,
  validatorHandler(schemaUpdateProfile, 'body'),
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const result = await updateUserProfile(req.body, userId);
  return res.sendResponse(result.status, result.message, result.data);
});

router.patch(
  USER_ROUTES.CHANGE_AVATAR,
  isAuth,
  validatorHandler(schemaChangeAvatar, 'body'),
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const result = await updateUserAvatar(req.body, userId);
  return res.sendResponse(result.status, result.message, result.data);
});

router.patch(
  USER_ROUTES.CHANGE_EMAIL,
  isAuth,
  validatorHandler(schemaChangeEmail, 'body'),
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const result = await changeEmailUser(req.body, userId);
  return res.sendResponse(result.status, result.message, result.data);
});

router.patch(
  USER_ROUTES.CHANGE_PASSWORD,
  isAuth,
  validatorHandler(schemaChangePassword, 'body'),
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const result = await changePasswordUser(req.body, userId);
  return res.sendResponse(result.status, result.message, result.data);
});

export default router;
