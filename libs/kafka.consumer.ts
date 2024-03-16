import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka, EachMessagePayload, EachBatchPayload } from 'kafkajs';

import { createKafkaMessageEvent, emitter } from './constants';
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

    const error: Omit<OnKafkaHandlerReturnType, 'value'>[] = [];
    const success: Omit<OnKafkaHandlerReturnType, 'error'>[] = [];

    while (results.length > 0) {
      const result = results.shift();

      if (result.error) {
        error.push({ handler: result.handler, error: result.error });
      } else {
        success.push({ handler: result.handler, value: result.value });
      }
    }

    this.logger.debug(JSON.stringify(success, null, 2));

    if (error.length > 0) {
      this.logger.error(JSON.stringify(error, null, 2));
    }
  }

  private async eachMessage(eachMessagePayload: EachMessagePayload) {
    const event = createKafkaMessageEvent(eachMessagePayload.topic);
    const messagePayload = new KafkaMessagePayload(eachMessagePayload);
    const results = await emitter.emitAsync(event, messagePayload);

    this.logging(results);
  }

  private async eachBatch(eachBatchPayload: EachBatchPayload) {
    const event = createKafkaMessageEvent(eachBatchPayload.batch.topic);
    const batchPayloiad = new KafkaBatchPayload(eachBatchPayload);
    const results = await emitter.emitAsync(event, batchPayloiad);

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
