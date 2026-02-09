const express = require("express");

const authRouters = require("../routes/auth.router");
const userRouters = require("../routes/user.router");

function apiRouter(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', authRouters);
  router.use('/users', userRouters);
}

module.exports = apiRouter;
