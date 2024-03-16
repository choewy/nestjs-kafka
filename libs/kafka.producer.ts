import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerBatch, ProducerRecord, RecordMetadata } from 'kafkajs';

import { KafkaProducerOptions } from './interfaces';

@Injectable()
export class KafkaProducer implements Omit<Producer, 'logger'>, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducer.name);
  private readonly producer: Producer;

  constructor(
    private readonly kafka: Kafka,
    private readonly options: KafkaProducerOptions,
  ) {
    this.producer = this.kafka.producer(this.options);
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private logging(value: RecordMetadata[]) {
    if (this.options.logging === false) {
      return;
    }

    this.logger.debug(JSON.stringify(value, null, 2));
  }

  async send(record: ProducerRecord): Promise<RecordMetadata[]> {
    return this.producer.send(record).then((value) => {
      this.logging(value);
      return value;
    });
  }

  async sendBatch(batch: ProducerBatch): Promise<RecordMetadata[]> {
    return this.producer.sendBatch(batch).then((value) => {
      this.logging(value);
      return value;
    });
  }

  get connect() {
    return this.producer.connect;
  }

  get disconnect() {
    return this.producer.disconnect;
  }

  get isIdempotent() {
    return this.producer.isIdempotent;
  }

  get on() {
    return this.producer.on;
  }

  get transaction() {
    return this.producer.transaction;
  }

  get events() {
    return this.producer.events;
  }
}
