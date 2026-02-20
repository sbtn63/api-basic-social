
const MIDDLEWARE_MESSAGES = Object.freeze({
  INTERNAL_ERROR_SERVE: "Error internal server",
  UNAUTHORIZED_TOKEN: "Unauthorized, missing or invalid token",
  VALIDATION_ERROR: "Validation Error",
  TOO_MANY_REQUESTS: "Maximum Attempts Error"
});

module.exports = {
  MIDDLEWARE_MESSAGES,
}
