
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error internal server";
  const data = err.details || null;
  res.sendResponse(status, message, data);
};

module.exports = errorHandler;
