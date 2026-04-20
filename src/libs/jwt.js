import jwt from 'jsonwebtoken';
import config from '../config/index.cjs';

function generateJwt(id) {
  try {
    const token = jwt.sign(
      { sub: id },
      config.jwtKey,
      { algorithm: 'HS256', expiresIn: config.jwtExpires}
    );

    return token;
  } catch (err) {
    throw new Error(`Error al generar el token: ${err.message}`, { cause: err });
  }
}

export default generateJwt;
