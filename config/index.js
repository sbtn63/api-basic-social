const dotenv = require('dotenv');
const path = require('path');

// 1. Determinar que archivo cargar
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;
dotenv.config({path: path.resolve(process.cwd(), envFile)});

// 2. Objeto de configuracion centralizado
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'dev',
  apiKey: process.env.API_KEY
};

// 3. Validación: Asegurar que variables críticas existan
const requireKeys = ['API_KEY'];
requireKeys.forEach(key => {
  if(!process.env[key]){
    throw new Error(`Error de configuración: La variable ${key} es obligatoria en ${envFile}`);
  }
});

module.exports = config;
