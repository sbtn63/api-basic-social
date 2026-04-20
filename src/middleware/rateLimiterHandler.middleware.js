import rateLimit from 'express-rate-limit';
import { MIDDLEWARE_MESSAGES } from './const.js';
import config from '../config/index.cjs';

const loginLimiter = rateLimit({
  windowMs: config.loginLimitWindowMs || 900000,
  max: config.loginLimitMax || 5,
  handler: (req, res, next) => {
    return res.status(429).json({
        status: 429,
        message: MIDDLEWARE_MESSAGES.TOO_MANY_REQUESTS,
        data: null
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { loginLimiter };
