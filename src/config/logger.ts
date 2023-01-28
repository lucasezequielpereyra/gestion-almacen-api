import {
  format as _format,
  createLogger,
  transports as _transports
} from 'winston';

const format = _format.combine(
  _format.colorize(),
  _format.timestamp({ format: 'YYYY-MM-DD   HH:mm' }),
  _format.align(),
  _format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = {
  error: createLogger({
    level: 'error',
    format: format,
    transports: [
      new _transports.File({ filename: './log/error.log' }),
      new _transports.Console({ level: 'error' })
    ]
  }),
  warn: createLogger({
    level: 'warn',
    format: format,
    transports: [
      new _transports.File({ filename: './log/warn.log' }),
      new _transports.Console({ level: 'warn' })
    ]
  }),
  info: createLogger({
    level: 'info',
    format: format,
    transports: [new _transports.Console({ level: 'info' })]
  })
};

export default logger;
