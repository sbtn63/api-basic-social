const express = require('express');

const apiRouter = require("./server/index");
const config = require('./config');
const responseFormat = require('./middleware/responseFormat.middleware');
const { authMiddleware } = require('./middleware/auth.middleware');

const app = express();

app.use(express.json());
app.use(responseFormat);
app.use(authMiddleware);

app.get("/", (req, res) => {
  return res.json({
    "Message" : "Welcome Basic Social API!!"
  });
});

apiRouter(app);

app.listen(config.port, (req, res) => {
  console.log(`Puerto escuchando en el ${config.port}`);
});
