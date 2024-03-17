import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import EventEmitter2 from 'eventemitter2';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka, EachMessagePayload, EachBatchPayload } from 'kafkajs';

import { createKafkaMessageEvent } from './constants';
import { OnKafkaHandlerReturnType } from './decorators/types';
import { KafkaBatchPayload, KafkaMessagePayload } from './implements';
import { KafkaConsumerOptions } from './interfaces';

@Injectable()
export class KafkaConsumer implements Omit<Consumer, 'logger'>, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumer.name);
  private readonly consumer: Consumer;

  constructor(
    private readonly kafka: Kafka,
    private readonly options: KafkaConsumerOptions,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.consumer = this.kafka.consumer(this.options);
  }

  async onModuleInit() {
    await this.connect();

    if (this.options.subscriptions) {
      await this.subscribe(this.options.subscriptions);
      await this.run();
    }
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private logging(results: OnKafkaHandlerReturnType[]) {
    if (this.options.logging === false) {
      return;
    }

    const total = results.length;
    const errors = [];

    let error = 0;
    let success = 0;

    for (const result of results) {
      if (result.error) {
        error++;
        errors.push({
          context: result.context.getClass()?.name,
          handler: result.context.getHandler()?.name,
          error: {
            name: result.error.name,
            message: result.error.message,
            stack: result.error.stack,
          },
        });
      } else {
        success++;
      }
    }

    this.logger.debug(JSON.stringify({ total, success, error }, null, 2));

    if (error > 0) {
      this.logger.error(JSON.stringify({ errors }, null, 2));
    }
  }

  private async eachMessage(eachMessagePayload: EachMessagePayload) {
    const event = createKafkaMessageEvent(eachMessagePayload.topic);
    const messagePayload = new KafkaMessagePayload(eachMessagePayload);
    const results = await this.eventEmitter.emitAsync(event, messagePayload);

    this.logging(results);
  }

  private async eachBatch(eachBatchPayload: EachBatchPayload) {
    const event = createKafkaMessageEvent(eachBatchPayload.batch.topic);
    const batchPayloiad = new KafkaBatchPayload(eachBatchPayload);
    const results = await this.eventEmitter.emitAsync(event, batchPayloiad);

    this.logging(results);
  }

  get connect() {
    return this.consumer.connect;
  }

  get disconnect() {
    return this.consumer.disconnect;
  }

  async subscribe(subscription: ConsumerSubscribeTopics): Promise<void> {
    await this.consumer.subscribe(subscription);
  }

  async run(config: ConsumerRunConfig = {}): Promise<void> {
    await this.consumer.run({
      autoCommit: true,
      eachBatch: this.eachBatch.bind(this),
      eachMessage: this.eachMessage.bind(this),
      ...config,
    });
  }

  get stop() {
    return this.consumer.stop;
  }

  get commitOffsets() {
    return this.consumer.commitOffsets;
  }

  get seek() {
    return this.consumer.seek;
  }

  get describeGroup() {
    return this.consumer.describeGroup;
  }

  get pause() {
    return this.consumer.pause;
  }

  get paused() {
    return this.consumer.paused;
  }

  get resume() {
    return this.consumer.resume;
  }

  get on() {
    return this.consumer.on;
  }

  get events() {
    return this.consumer.events;
  }
}
