import bcrypt from 'bcrypt';
import config from '../config/index.cjs';

async function genHashSaltPassword(password) {
  try {
    const hash = await bcrypt.hash(password, config.bcryptSaltRounds);
    return hash;
  } catch (err) {
    throw new Error(`Error al generar el hash: ${err.message}`, { cause: err });
  }
}

async function checkPassword(password, passwordHash) {
  try {
    const isMatch = await bcrypt.compare(password, passwordHash);
    return isMatch;
  } catch (err) {
    throw new Error(`Error al comparar contraseñas: ${err.message}`, { cause: err });
  }
}

export {
  genHashSaltPassword,
  checkPassword
};
