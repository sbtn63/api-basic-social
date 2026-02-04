const { expressJwt: jwt} = require("express-jwt");
const config = require("../config/index");

const authMiddleware = jwt({
    secret: config.jwtKey,
    algorithms: ["HS256"],
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req, res) {
      if (req.headers.authorization?.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
      }

      if (req.query?.token) {
        return req.query.token;
      }

      return null;
    },
});

module.exports = authMiddleware;
