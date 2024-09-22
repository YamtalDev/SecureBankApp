import logger from '../config/logger';
import { closeDB } from '../config/database';

export const gracefulShutdown = (server: any) => {
  return async () => {
    logger.info('Gracefully shutting down');

    server.close(async () => {
      logger.info('HTTP server closed');
      await closeDB();
      process.exit(0);
    });
  };
};
