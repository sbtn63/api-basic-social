
const responseFormat = (req, res, next) => {
  res.sendResponse = (statusCode, message, data = null) => {
    return res.status(statusCode).json({
      status: statusCode,
      message: message,
      data: data,
      path: req.originalUrl
    });
  };
  next();
};

export default responseFormat;
