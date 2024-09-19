import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf, errors, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, '../../logs/app.log'),
      level: 'info',
      maxsize: 5242880,
      maxFiles: 5,
    })
  ],
});

export default logger;
