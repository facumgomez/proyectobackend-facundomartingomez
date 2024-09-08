import mongoose from 'mongoose';
import config from '../config/config.js';
import logger from '../helpers/logger.js';

const URI = config.MONGO_URL;
mongoose.set('strictQuery', false);

const connectMongoDB = async () => {
  try {
    await mongoose.connect(URI);
    logger.info('MongoDB conectado!');
  } catch (error) {
    logger.error('Error conectando a MongoDB:', error);
    process.exit(1); 
  };
};

connectMongoDB();