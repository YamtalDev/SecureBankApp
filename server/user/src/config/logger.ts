import { createLogger, format, transports } from 'winston';
import { config } from './config';
import path from 'path';

const { combine, timestamp, printf, errors, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, '../../logs/app.log'),
      level: 'info',
      maxsize: 5242880,
      maxFiles: 5,
    })
  ],
});

if (config.nodeEnv === 'development') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      logFormat
    )
  }));
}

export default logger;
