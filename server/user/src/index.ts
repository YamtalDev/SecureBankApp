import cors from 'cors';
import helmet from 'helmet';
import express from 'express';

import logger from './config/logger';
import { config } from './config/config';
import userRoutes from './routes/userRoutes';
import { connectDB, closeDB } from './config/database';

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);

const startServer = async () => {
  try {
    await connectDB(config.mongodbUri);

    const server = app.listen(config.port, () => {
      logger.info(`User Service running on port ${config.port}.`);
    });

    const gracefulShutdown = async () => {
      logger.info('Gracefully shutting down');

      server.close(async () => {
        logger.info('HTTP server closed');
        await closeDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

startServer();
