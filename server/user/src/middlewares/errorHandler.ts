import { NextFunction, Request, Response } from 'express';
import { isHttpError } from 'http-errors';
import logger from '../config/logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (isHttpError(err)) {
    logger.warn(`Error: ${err.message}`);
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  
  // Fallback for other unhandled errors (500 Internal Server Error)
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  return res.status(500).json({
    status: 500,
    message: 'Internal server error.',
  });
};

export default errorHandler;