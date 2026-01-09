const express = require('express');
const config = require('./config');

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    "Message" : "Welcome Basic Social API!!"
  });
});

app.listen(config.port, (req, res) => {
  console.log(`Puerto escuchando en el ${config.port}`);
});
