import { Batch } from 'kafkajs';
import { KafkaMessage } from './kafka-message';

export class KafkaBatch {
  readonly topic: string;
  readonly partition: number;
  readonly highWatermark: string;
  readonly messages: KafkaMessage[];
  isEmpty: () => boolean;
  fisrtOffset: () => string;
  lastOffset: () => string;
  offsetLag: () => string;
  offsetLagLow: () => string;

  constructor(batch: Batch) {
    this.topic = batch.topic;
    this.partition = batch.partition;
    this.highWatermark = batch.highWatermark;
    this.messages = batch.messages.map((message) => new KafkaMessage(message));
    this.isEmpty = batch.isEmpty;
    this.fisrtOffset = batch.firstOffset;
    this.lastOffset = batch.lastOffset;
    this.offsetLag = batch.offsetLag;
    this.offsetLagLow = batch.offsetLagLow;
  }
}
