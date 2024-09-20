import { createServer } from './services/server';
import { connectDB } from './config/database';
import { config } from './config/config';
import logger from './config/logger';
import { gracefulShutdown } from './services/shutdown';

const startServer = async () => {
  try {
    await connectDB(config.mongodbUri);
    const server = createServer().listen(config.port, () => {
      logger.info(`User Service running securely on HTTPS port ${config.port}.`);
    });

    process.on('SIGTERM', gracefulShutdown(server));
    process.on('SIGINT', gracefulShutdown(server));
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

startServer();
