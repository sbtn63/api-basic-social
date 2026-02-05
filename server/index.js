const express = require("express");

const authRouters = require("../routes/auth.router");

function apiRouter(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', authRouters);
}

module.exports = apiRouter;
