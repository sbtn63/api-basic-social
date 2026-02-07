
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error internal server";
  const data = err.details || null;
  return res.status(status).json({
    status,
    message,
    data,
    path: req.originalUrl
  });
};

module.exports = errorHandler;
