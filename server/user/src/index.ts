import logger from './config/logger';
import { config } from './config/config';
import { connectDB } from './config/database';
import { createServer } from './services/server';
import { gracefulShutdown } from './services/shutdown';

const startServer = async () => {
  try {
    await connectDB(config.mongodbUri);
    const { app, httpsServer } = createServer();

    httpsServer.listen(config.port, () => {
      logger.info(`User Service running securely on HTTPS port ${config.port}.`);
    });


    process.on('SIGTERM', gracefulShutdown(httpsServer));
    process.on('SIGINT', gracefulShutdown(httpsServer));
    return app;
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

if (config.nodeEnv !== 'test') {
  startServer();
}

export default startServer;
