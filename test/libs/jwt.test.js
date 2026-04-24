import { expect } from 'chai';

import config from '../../src/config/index.cjs';
import generateJwt from '../../src/libs/jwt.js';

describe('JWT Tests', () => {
  it('Validation success generateJwt', async () => {
    const id = 'test@gmail.com';
    const token = generateJwt(id);

    expect(token).to.be.a('string');
    expect(token.length).to.be.at.least(20);
  });

  it('Generation failed', () => {
    const originalKey = config.jwtKey;
    config.jwtKey = undefined;

    expect(() => generateJwt(1))
      .to.throw("Error al generar el token");

    config.jwtKey = originalKey;
  });
});
