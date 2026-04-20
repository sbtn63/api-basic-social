import express from 'express';

import apiRouter from './server/index.js';
import responseFormat from './middleware/responseFormat.middleware.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import errorHandler from './middleware/errorHandler.middleware.js';

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(responseFormat);
app.use(authMiddleware);

app.get("/", (req, res) => {
  return res.json({
    "Message" : "Welcome Basic Social API!!"
  });
});

apiRouter(app);

app.use(errorHandler);

export default app;
