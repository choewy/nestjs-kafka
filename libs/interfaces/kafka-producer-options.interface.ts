import { ProducerConfig } from 'kafkajs';

export interface KafkaProducerOptions extends ProducerConfig {
  logging?: boolean;
}
