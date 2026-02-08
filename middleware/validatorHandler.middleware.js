const ResponseError = require("../schemas/responseError.schema");
const { MIDDLEWARE_MESSAGES } = require("./const");

function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const validationErrors = {};
      error.details.forEach(item => {
        validationErrors[item.context.key] = item.message;
      });

      const appError = new ResponseError(MIDDLEWARE_MESSAGES.VALIDATION_ERROR, 400);
      appError.details = validationErrors;

      return next(appError);
    }

    next();
  };
}

module.exports = validatorHandler;
