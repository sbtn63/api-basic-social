import { expect } from 'chai';
import sinon from 'sinon';
import Joi from 'joi';

import validatorHandler from '../../src/middleware/validatorHandler.middleware.js';
import ResponseError from '../../src/schemas/responseError.schema.js';

describe("Validator Handle middleware", () => {
  let req, res, next;

  beforeEach(() => {
    res = {};
    next = sinon.spy();
  });

  it("should call next with validation error", () => {
    const schema = Joi.object({name: Joi.string().required()});
    req = {body: {}};
    const middleware = validatorHandler(schema, "body");
    middleware(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.be.instanceOf(ResponseError);
    expect(next.firstCall.args[0].status).to.equal(400);
    expect(next.firstCall.args[0].details).to.deep.equal({
      name: '"name" is required'
    });
  });

  it("should call next without error when data is valid", () => {
    const schema = Joi.object({name: Joi.string().required()});
    req = {body: { name: "Juan" }};
    const middleware = validatorHandler(schema, "body");
    middleware(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args.length).to.equal(0);
  });
});
