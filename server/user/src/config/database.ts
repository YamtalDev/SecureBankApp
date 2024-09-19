import mongoose from 'mongoose';
import logger from './logger';

export const connectDB = async (MONGODB_URI: string): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB.');
  } catch (err) {
    logger.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close(false);
    logger.info('MongoDB connection closed.');
  } catch (err) {
    logger.error('Error closing MongoDB connection:', err);
  }
};
