const express = require("express");

const {AUTH_ROUTES} = require("./consts");
const { registerUser, loginUser } = require("../services/auth.service");
const validatorHandler = require("../middleware/validatorHandler.middleware");
const { loginSchema, registerSchema } = require("../schemas/authSchema.schema");

const router = express.Router();

router.post(
  AUTH_ROUTES.LOGIN,
  validatorHandler(loginSchema, 'body'),
  async (req, res, next) =>
{
  try {
    const result = await loginUser(req.body);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

router.post(
  AUTH_ROUTES.REGISTER,
  validatorHandler(registerSchema, 'body'),
  async (req, res, next) =>
{
  try {
    const result = await registerUser(req.body);
    return res.sendResponse(result.status, result.message, result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
