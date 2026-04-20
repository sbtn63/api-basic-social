import express from 'express';

import authRouters from '../routes/auth.router.js';
import userRouters from '../routes/user.router.js';
import postRouters from '../routes/post.router.js';
import commentRouters from '../routes/comment.router.js';

function apiRouter(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', authRouters);
  router.use('/users', userRouters);
  router.use('/posts', postRouters);
  router.use('/comments/', commentRouters);
}

export default apiRouter;
