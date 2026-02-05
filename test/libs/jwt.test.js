const { expect } = require("chai");
const chai = require("chai");

const config = require("../../config/index");
const generateJwt = require("../../libs/jwt");

describe('JWT Tests', () => {
  it('Validation success generateJwt', async () => {
    const email = 'test@gmail.com';
    const token = generateJwt(email);

    expect(token).to.be.a('string');
    expect(token.length).to.be.at.least(20);
  });

  it('Generation failed', () => {
    const originalKey = config.jwtKey;
    config.jwtKey = undefined;

    expect(() => generateJwt('test@email.com'))
      .to.throw("Error al generar el token");

    config.jwtKey = originalKey;
  });
});
