import ResponseError from '../schemas/responseError.schema.js';
import { MIDDLEWARE_MESSAGES } from './const.js';

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

export default validatorHandler;
