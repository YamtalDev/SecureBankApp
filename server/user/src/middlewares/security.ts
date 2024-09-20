import cors from 'cors';
import helmet from 'helmet';
import { Express } from 'express';

export const applySecurityMiddlewares = (app: Express) => {
  app.use(helmet());
  app.use(cors());
};
