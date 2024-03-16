import { EachMessagePayload } from 'kafkajs';

import { KafkaMessage } from './kafka-message';

export class KafkaMessagePayload {
  readonly topic: string;
  readonly partition: number;
  readonly message: KafkaMessage;
  heartbeat: () => Promise<void>;
  pause: () => void;

  constructor(eachMessagePayload: EachMessagePayload) {
    this.topic = eachMessagePayload.topic;
    this.partition = eachMessagePayload.partition;
    this.message = new KafkaMessage(eachMessagePayload.message);
    this.heartbeat = eachMessagePayload.heartbeat;
    this.pause = eachMessagePayload.pause;
  }
}
