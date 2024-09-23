import Joi from 'joi';
import dotenv from 'dotenv';

import logger from './logger';

dotenv.config();
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .messages({ 'any.only': 'NODE_ENV must be one of development, production, or test.' }),

  MONGODB_URI: Joi.string()
    .uri()
    .default(process.env.MONGODB_URI || "mongodb://localhost:27017/users")
    .messages({ 'any.required': 'MONGODB_URI is required. Provide it in .env or via the environment variables.' }),

  PORT: Joi.number()
    .default(process.env.PORT || process.env.DEFAULT_PORT || 5000),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
  logger.error(`Configuration validation error: ${error.message}`);
  process.exit(1);
}

export const config = {
  port: envVars.PORT,
  mongodbUri: envVars.MONGODB_URI,
  nodeEnv: envVars.NODE_ENV,
};
