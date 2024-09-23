import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { validateUser, validateUserId, validatePatchData } from '../../src/middlewares/validationMiddleware';
import createError from 'http-errors';

// Mocking modules
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(),
}));

jest.mock('http-errors', () => jest.fn(() => new Error()));

describe('Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {};
    next = jest.fn();
  });

  describe('validateUser', () => {
    it('should pass validation with valid data', () => {
      req.body = {
        email: 'test@example.com',
        password: 'Password123!',
        phoneNumber: '+123456789',
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });

      validateUser[validateUser.length - 1](req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation with invalid email', () => {
      req.body = {
        email: 'invalid-email',
        password: 'Password123!',
        phoneNumber: '+123456789',
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Invalid email format' }],
      });

      validateUser[validateUser.length - 1](req as Request, res as Response, next);

      expect(createError).toHaveBeenCalledWith(400, 'Invalid email format');
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('validateUserId', () => {
    it('should pass validation with valid user ID', () => {
      req.params = { id: '507f191e810c19729de860ea' };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });

      validateUserId[validateUserId.length - 1](req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation with invalid user ID', () => {
      req.params = { id: 'invalid-id' };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Invalid user ID format' }],
      });

      validateUserId[validateUserId.length - 1](req as Request, res as Response, next);

      expect(createError).toHaveBeenCalledWith(400, 'Invalid user ID format');
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('validatePatchData', () => {
    it('should pass validation with valid patch data', () => {
      req.body = { amount: 100 };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });

      validatePatchData[validatePatchData.length - 1](req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation with missing amount', () => {
      req.body = {};

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Amount is required' }],
      });

      validatePatchData[validatePatchData.length - 1](req as Request, res as Response, next);

      expect(createError).toHaveBeenCalledWith(400, 'Amount is required');
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
