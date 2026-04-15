const express = require("express");

const authRouters = require("../routes/auth.router");
const userRouters = require("../routes/user.router");
const postRouters = require("../routes/post.router");
const commentRouters = require("../routes/comment.router");

function apiRouter(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', authRouters);
  router.use('/users', userRouters);
  router.use('/posts', postRouters);
  router.use('/comments/', commentRouters);
}

module.exports = apiRouter;
