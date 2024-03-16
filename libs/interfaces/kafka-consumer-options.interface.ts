import { ConsumerConfig, ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';

export interface KafkaConsumerOptions extends ConsumerConfig {
  subscriptions?: ConsumerSubscribeTopics;
  runOptions?: Omit<ConsumerRunConfig, 'eachMessage' | 'eachBatch'>;
  logging?: boolean;
}
