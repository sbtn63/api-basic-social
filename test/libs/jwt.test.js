const { expect } = require("chai");
const chai = require("chai");

const generateJwt = require("../../libs/jwt");

describe('JWT Tests', () => {
  it('Validation success generateJwt', async () => {
    const email = 'test@gmail.com';
    const token = generateJwt(email);

    expect(token).to.be.a('string');
    expect(token.length).to.be.at.least(20);
  });

  it('Generation failed', async () => {
    try {
      generateJwt(null);
    } catch (err) {
      expect(err).to.be.an('error');
      expect(err.message).to.contain("Error al generar el token");
    }
  });
});
