import crypto from 'node:crypto';

const generateVerificationCode = () =>
  crypto.randomInt(100000, 1000000).toString();

export default generateVerificationCode;
