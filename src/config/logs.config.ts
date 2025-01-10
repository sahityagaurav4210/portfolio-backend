import { Logger } from 'winston';
import * as winston from 'winston';

export function init(): Logger {
  return winston.createLogger({
    levels: { error: 1, info: 3 },
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
      new winston.transports.File({
        filename: 'logs/info.log',
        level: 'info',
        format: winston.format.json(),
      }),

      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.json(),
      }),
    ],
  });
}
