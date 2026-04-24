import app from './app.js';
import config from './config/index.cjs';

app.listen(config.port, () => {
    console.log(`Puerto escuchando en el ${config.port}`);
});
