import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

const handleValidationErrors = (req: Request, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg).join(', ');
    return next(createError(400, errorMessages));
  }
  next();
};


export const validateUser = [
  body('email')
    .exists().withMessage('Email is required')
    .trim().isEmail().withMessage('Invalid email format'),

  body('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Must be at least 6 characters long')
    .matches(/^(?=.*[a-z])/).withMessage('Must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/).withMessage('Must contain at least one uppercase letter')
    .matches(/^(?=.*\d)/).withMessage('Must contain at least one digit')
    .matches(/^(?=.*[\W_])/).withMessage('Must contain at least one special character `!, @, $`')
    .trim(),

  body('phoneNumber')
    .exists().withMessage('Phone number is required')
    .trim().matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format. Please enter a valid international phone number'),
    (req: Request, res: Response, next: NextFunction) => handleValidationErrors(req, next),
];

export const validateUserId = [
  param('id').isMongoId().withMessage('Invalid user ID format'),
  (req: Request, res: Response, next: NextFunction) => handleValidationErrors(req, next),
];

export const validatePatchData = [
  body('amount')
    .exists().withMessage('Amount is required')
    .isFloat({ min: -Infinity }).withMessage('Amount must be a valid number')
    .toFloat(),
  (req: Request, res: Response, next: NextFunction) => handleValidationErrors(req, next),
];