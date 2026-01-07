const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    "Message" : "Welcome Basic Social API!!"
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Puerto escuchando en el ${PORT}`);
});
