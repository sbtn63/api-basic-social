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
  bcryptSaltRounds: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  jwtKey: process.env.JWT_KEY,
  jwtExpires: process.env.JWT_EXPIRES,
  loginLimitWindowMs: Number.parseInt(process.env.LOGIN_LIMIT_WINDOW_MS, 10) || 900000,
  loginLimitMax: Number.parseInt(process.env.LOGIN_LIMIT_MAX, 10) || 5,
  expiresCodeOTPMinutes: Number.parseInt(process.env.CODE_OTP_MINUTES, 10) || 90,
  brevoApiKey: process.env.BREVO_API_KEY,
  brevoTimeoutSeconds: Number.parseInt(process.env.BREVO_TIMEOUT_IN_SECONDS, 10) || 30,
  brevoMaxRetries: Number.parseInt(process.env.BREVO_MAX_RETRIES, 10) || 3,
};

// 3. Validación: Asegurar que variables críticas existan
const requireKeys = ['API_KEY', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST', 'DB_DIALECT'];
requireKeys.forEach(key => {
  if(!process.env[key]){
    throw new Error(`Error de configuración: La variable ${key} es obligatoria en ${envFile}`);
  }
});

module.exports = config;
