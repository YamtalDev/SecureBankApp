import Joi from 'joi';
import dotenv from 'dotenv';

import logger from './logger';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  MONGODB_URI: Joi.string().default("mongodb://localhost:27017/userdb").uri().required(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  logger.error(`Configuration validation error: ${error.message}`);
  process.exit(1);
}

export const config = {
  port: envVars.PORT,
  mongodbUri: envVars.MONGODB_URI,
};
