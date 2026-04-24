import express from 'express';

import { AUTH_ROUTES } from './consts.js';
import { registerUser, loginUser } from '../services/auth.service.js';
import validatorHandler from '../middleware/validatorHandler.middleware.js';
import { loginSchema, registerSchema } from '../schemas/authSchema.schema.js';
import { loginLimiter } from '../middleware/rateLimiterHandler.middleware.js';

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

export default router;
