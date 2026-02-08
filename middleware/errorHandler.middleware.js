const { MIDDLEWARE_MESSAGES } = require("./const");

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || MIDDLEWARE_MESSAGES.INTERNAL_ERROR_SERVE;
  const data = err.details || null;
  return res.status(status).json({
    status,
    message,
    data,
    path: req.originalUrl
  });
};

module.exports = errorHandler;
