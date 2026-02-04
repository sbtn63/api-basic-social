const jwt = require("jsonwebtoken");
const config = require("../config/index");

function generateJwt(email) {
  try {
    const token = jwt.sign(
      { sub: email },
      config.jwtKey,
      { algorithm: 'HS256', expiresIn: config.jwtExpires}
    );

    return token;
  } catch (err) {
    throw new Error(`Error al generar el token: ${err.message}`);
  }
}

module.exports = generateJwt;
