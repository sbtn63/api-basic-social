const jwt = require("jsonwebtoken");
const config = require("../config/index");

function generateJwt(id) {
  try {
    const token = jwt.sign(
      { sub: id },
      config.jwtKey,
      { algorithm: 'HS256', expiresIn: config.jwtExpires}
    );

    return token;
  } catch (err) {
    throw new Error(`Error al generar el token: ${err.message}`);
  }
}

module.exports = generateJwt;
