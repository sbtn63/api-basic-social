import { BrevoClient } from '@getbrevo/brevo';
import ResponseError  from '../schemas/responseError.schema.js';
import config from '../config/index.cjs';

const client = new BrevoClient({
  apiKey: config.brevoApiKey,
  timeoutInSeconds: config.brevoTimeoutSeconds,
  maxRetries: config.brevoMaxRetries,
});

async function sendVerificationEmail(email, params) {
  try {
    return await client.transactionalEmails.sendTransacEmail({
      to: [{ email }],
      templateId: 2,
      params
    });
  } catch (error) {
    throw new ResponseError(
      error.status || error.statusCode || 500,
      error.message || 'Error sending email',
      error.response?.body ?? error.response ?? error
    );
  }
}

export {
  sendVerificationEmail,
};
