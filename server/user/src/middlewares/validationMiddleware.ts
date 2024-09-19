// middlewares/validationMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUser = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format.'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/^(?=.*[A-Z])/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/^(?=.*\d)/)
    .withMessage('Password must contain at least one digit.')
    .matches(/^(?=.*[\W_])/)
    .withMessage('Password must contain at least one special character.')
    .trim(),

  body('phoneNumber')
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format. Please enter a valid international phone number.'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  },
];
