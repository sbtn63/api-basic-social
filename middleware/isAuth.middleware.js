const { MIDDLEWARE_MESSAGES } = require("./const");

const isAuth = (req, res, next) => {
  if(!req.auth) {
    return res.sendResponse(401, MIDDLEWARE_MESSAGES.UNAUTHORIZED_TOKEN);
  }
  next();
};

module.exports = isAuth;
