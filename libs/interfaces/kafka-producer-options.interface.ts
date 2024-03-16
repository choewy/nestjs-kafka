import { ProducerConfig } from 'kafkajs';

export interface KafkaProducerOptions extends ProducerConfig {
  use: boolean;
  logging?: boolean;
}
