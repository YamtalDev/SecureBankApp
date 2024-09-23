import fs from 'fs';
import https from 'https';
import express from 'express';

import userRoutes from '../routes/userRoutes';
import rateLimiter from '../middlewares/rateLimiter';
import errorHandler from '../middlewares/errorHandler';
import { applySecurityMiddlewares } from '../middlewares/security';

export const createServer = () => {
  const app = express();

  // SSL Configuration
  const sslOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
  };

  app.use(rateLimiter);
  applySecurityMiddlewares(app);
  app.use(express.json());
  
  app.use('/api/users', userRoutes);
  app.use(errorHandler);
  
  const httpsServer = https.createServer(sslOptions, app);
  
  return { app, httpsServer };
};
