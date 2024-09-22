import mongoose from 'mongoose';
import logger from './logger';

export const connectDB = async (MONGODB_URI: string): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB.');
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error connecting to MongoDB:', err.message);
      logger.error('Stack trace:', err.stack);
    } else {
      logger.error('Unknown error connecting to MongoDB:', err);
    }

    throw err;
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