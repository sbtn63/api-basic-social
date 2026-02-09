const { expressjwt } = require("express-jwt");
const config = require("../config/index");

function getTokenFromHeaderOrQuery(req) {
  if (req.headers.authorization?.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  if (req.query?.token) {
    return req.query.token;
  }
  return null;
}

const authMiddleware = expressjwt({
  secret: config.jwtKey,
  algorithms: ["HS256"],
  credentialsRequired: false,
  getToken: getTokenFromHeaderOrQuery,
});

module.exports = {
  authMiddleware,
  getTokenFromHeaderOrQuery,
};
