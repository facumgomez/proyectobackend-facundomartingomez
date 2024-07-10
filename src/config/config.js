import dotenv from 'dotenv';

dotenv.config();

export default {
  MONGO_URL: process.env.MONGO_URL,
  PERSISTENCE: process.env.PERSISTENCE,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ENVIRONMENT: process.env.ENVIRONMENT,
};