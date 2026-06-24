import express from 'express';

import { AUTH_ROUTES } from './consts.js';
import { registerUser, loginUser, requestVerifiedEmail, verifyEmail } from '../services/auth.service.js';
import validatorHandler from '../middleware/validatorHandler.middleware.js';
import { loginSchema, registerSchema, verifyCodeSchema } from '../schemas/authSchema.schema.js';
import { loginLimiter } from '../middleware/rateLimiterHandler.middleware.js';
import isAuth from '../middleware/isAuth.middleware.js';

const router = express.Router();

router.post(
  AUTH_ROUTES.LOGIN,
  loginLimiter,
  validatorHandler(loginSchema, 'body'),
  async (req, res, next) =>
{
  const result = await loginUser(req.body);
  return res.sendResponse(result.status, result.message, result.data);
});

router.post(
  AUTH_ROUTES.REGISTER,
  validatorHandler(registerSchema, 'body'),
  async (req, res, next) =>
{
  const result = await registerUser(req.body);
  return res.sendResponse(result.status, result.message, result.data);
});

router.post(
  AUTH_ROUTES.VERIFY_EMAIL_REQUEST,
  isAuth,
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const result = await requestVerifiedEmail(userId);
  return res.sendResponse(result.status, result.message, result.data);
});

router.post(
  AUTH_ROUTES.VERIFY_EMAIL_CONFIRM,
  isAuth,
  validatorHandler(verifyCodeSchema, 'body'),
  async (req, res, next) =>
{
  const userId = req.auth.sub;
  const { code } = req.body;
  const result = await verifyEmail(code, userId);
  return res.sendResponse(result.status, result.message, result.data);
});

export default router;
