import { Op } from 'sequelize';
import config from '../config/index.cjs';
import { models } from '../libs/sequelize.js';
import generateVerificationCode from '../libs/otpCode.js';


const addEmailVerification = async(email) => {
  const expiresAt = generateExpiresAt(config.expiresCodeOTPMinutes);
  const code = generateVerificationCode();
  return models.EmailVerification.create({
    email, expiresAt, code
  });
};

const getEmailVerification = async(email, code) => {
  const now = new Date();
  return models.EmailVerification.findOne({
    where: {
      email,
      code,
      isUsed: false,
      expiresAt: {[Op.gt] : now},
    }
  });
};

const changeIsUsed = async(emailVerification) => {
  return await emailVerification.update({
    isUsed: true
  });
};

const invalidateEmailVerification = async (verificationInstance) => {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);
  verificationInstance.expiresAt = pastDate;
  return await verificationInstance.save();
};

const getActiveEmailVerification = async (email) => {
  const now = new Date();

  return await models.EmailVerification.findOne({
    where: {
      email: email,
      isUsed: false,
      expiresAt: { [Op.gt]: now }
    },
    order: [['createdAt', 'DESC']]
  });
};

const generateExpiresAt = (minutesToAdd = 90) => {
  const now = new Date();
  return new Date(now.getTime() + minutesToAdd * 60 * 1000);
};

export {
  addEmailVerification,
  getEmailVerification,
  changeIsUsed,
  invalidateEmailVerification,
  getActiveEmailVerification
};
