const { expect } = require("chai");

const { authMiddleware, getTokenFromHeaderOrQuery } = require("../../src/middleware/auth.middleware");

describe('authMiddleware', () => {
  it('should extract token from header', () => {
    const req = {
      headers: {
        authorization: 'Bearer my-token'
      }
    };

    const token = getTokenFromHeaderOrQuery(req);
    expect(token).to.equal('my-token');
  });

  it('should get token from query', () => {
    const req = {
      headers: {},
      query: {
        token: 'my-token'
      }
    };

    console.log(req);
    const token = getTokenFromHeaderOrQuery(req);
    expect(token).to.equal('my-token');
  });

  it('should return null if no token', () => {
    const req = { headers: {}, query: {} };
    const token = getTokenFromHeaderOrQuery(req);
    expect(token).to.be.null;
  });

  it("should call next without error if no token", async () => {
    const req = { headers: {}, query: {} };
    const res = {};
    let called = false;
    const next = (err) => {
      called = true;
      expect(err).to.be.undefined;
    };

    await authMiddleware(req, res, next);
    expect(called).to.be.true;
  });
});
