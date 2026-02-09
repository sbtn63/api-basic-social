const bcrypt = require("bcrypt");
const config = require("../config/index");

async function genHashSaltPassword(password) {
  try {
    const hash = await bcrypt.hash(password, config.bcryptSaltRounds);
    return hash;
  } catch (err) {
    throw new Error(`Error al generar el hash: ${err.message}`);
  }
}

async function checkPassword(password, passwordHash) {
  try {
    const isMatch = await bcrypt.compare(password, passwordHash);
    return isMatch;
  } catch (err) {
    throw new Error(`Error al comparar contraseñas: ${err.message}`);
  }
}

module.exports = {
  genHashSaltPassword,
  checkPassword
};
