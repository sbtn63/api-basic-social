const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcrypt");

const { genHashSaltPassword, checkPassword } = require("../../src/libs/bcrypt");

describe('Bcrypt Tests', () => {
  it('Validation success genHashSaltPassword and CheckPassword', async () => {
    const password = "passwordTest";
    const hash = await genHashSaltPassword(password);
    const isMatch = await checkPassword(password, hash);

    expect(hash).to.be.a('string');
    expect(hash).to.not.equal(password);
    expect(hash.length).to.be.at.least(20);
    expect(isMatch).equal(true);
  });

  it('Validation success genHashSaltPassword and CheckPassword', async () => {
    const passwordMatch = "passwordTest";
    const otherPassword = "passwordTest2";
    const hash = await genHashSaltPassword(passwordMatch);
    const isMatch = await checkPassword(otherPassword, hash);

    expect(isMatch).equal(false);
  });

  it('Hash invalid', async () => {
    try {
      await checkPassword("algunPassword", "esto-no-es-un-hash-valido");
    } catch (err) {
      expect(err).to.be.an('error');
       expect(err.message).to.include("Error al comparar contraseñas");
    }
  });

  it('Generation failed', async () => {
    sinon.stub(bcrypt, 'hash').throws(new Error('boom'));

    let error;
    try {
      await genHashSaltPassword("password");
    } catch (err) {
      error = err;
    }

    expect(error).to.be.an('error');
    expect(error.message).to.contain("Error al generar el hash");

    bcrypt.hash.restore();
  });
});
