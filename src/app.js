const express = require('express');

const apiRouter = require("./server/index");
const responseFormat = require('./middleware/responseFormat.middleware');
const { authMiddleware } = require('./middleware/auth.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');

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

module.exports = app;
