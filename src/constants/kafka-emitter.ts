import EventEmitter2 from 'eventemitter2';

export const createKafkaMessageEvent = (topic: string) => ['kafka', 'message', topic].join('.');
export const createKafkaBatchEvent = (topic: string) => ['kafka', 'batch', topic].join('.');

export const kafkaEmitter = new EventEmitter2();
