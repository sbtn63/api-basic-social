const app = require("./app");
const config = require("./config");

app.listen(config.port, () => {
    console.log(`Puerto escuchando en el ${config.port}`);
});
