import { Request, Response, NextFunction } from 'express';
import errorHandler from '../../src/middlewares/errorHandler';
import logger from '../../src/config/logger';
import createError from 'http-errors';

jest.mock('../../src/config/logger');

describe('ErrorHandler Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle HTTP errors correctly', () => {
    errorHandler(createError(400, "Bad Request"), req as Request, res as Response, next);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request' });
    expect(logger.warn).toHaveBeenCalledWith('Error: Bad Request');
  });

  it('should handle internal server errors correctly', () => {
    const internalError = new Error('Something went wrong');

    errorHandler(internalError, req as Request, res as Response, next);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Internal server error.',
    });
    expect(logger.error).toHaveBeenCalledWith('Error: Something went wrong', { stack: internalError.stack });
  });
});
