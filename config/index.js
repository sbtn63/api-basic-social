const dotenv = require('dotenv');
const path = require('node:path');

// 1. Determinar que archivo cargar
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;
dotenv.config({path: path.resolve(process.cwd(), envFile)});

// 2. Objeto de configuracion centralizado
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'dev',
  apiKey: process.env.API_KEY,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT_HOST,
  dbDialect: process.env.DB_DIALECT,
  bcryptSaltRounds: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),
  jwtKey: process.env.JWT_KEY,
  jwtExpires: process.env.JWT_EXPIRES,
};

// 3. Validación: Asegurar que variables críticas existan
const requireKeys = ['API_KEY', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST', 'DB_DIALECT'];
requireKeys.forEach(key => {
  if(!process.env[key]){
    throw new Error(`Error de configuración: La variable ${key} es obligatoria en ${envFile}`);
  }
});

module.exports = config;
