import EventEmitter2 from 'eventemitter2';
import { LogEntry, logCreator, logLevel } from 'kafkajs';
import { Logger } from '@nestjs/common';

export const emitter = new EventEmitter2();
export const createKafkaMessageEvent = (topic: string) => ['kafka', 'message', topic].join('.');
export const createKafkaBatchEvent = (topic: string) => ['kafka', 'batch', topic].join('.');
export const createKafkaLogger: logCreator = (_: logLevel) => {
  return ({ namespace, level, log }: LogEntry) => {
    let method: keyof Logger;

    switch (level) {
      case logLevel.NOTHING:
        method = 'log';
        break;

      case logLevel.DEBUG:
        method = 'debug';
        break;

      case logLevel.ERROR:
        method = 'error';
        break;

      case logLevel.WARN:
        method = 'warn';
        break;

      case logLevel.INFO:
        method = 'verbose';
        break;
    }

    if (method in Logger === false) {
      method = 'log';
    }

    new Logger(namespace ?? log.logger)[method](log.message);
  };
};
