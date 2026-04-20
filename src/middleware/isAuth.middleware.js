import { MIDDLEWARE_MESSAGES } from './const.js';

const isAuth = (req, res, next) => {
  if(!req.auth) {
    return res.sendResponse(401, MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  }
  next();
};

export default isAuth;
