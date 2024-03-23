import { registerAs } from '@nestjs/config';
import { KafkaModuleOptions } from 'libs/interfaces';

export const KAFKA_CONFIG = '__KAFKA_CONFIG__';
export const KafkaConfig = registerAs(
  KAFKA_CONFIG,
  (): KafkaModuleOptions => ({
    clientId: 'kafka-consumer',
    brokers: ['localhost:29092'],
    producer: {
      use: true,
      allowAutoTopicCreation: true,
    },
    consumer: {
      groupId: 'consumer-group-1',
      subscriptions: {
        topics: ['message-topic-1', 'message-topic-2', 'message-topic-3'],
      },
    },
  }),
);
