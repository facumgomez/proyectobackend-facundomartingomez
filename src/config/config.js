import dotenv from 'dotenv';

dotenv.config();

export default {
  mongoURL: process.env.MONGO_URL,
  persistence: process.env.PERSISTENCE,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD
};