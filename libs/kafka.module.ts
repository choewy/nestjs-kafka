import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Kafka } from 'kafkajs';

import { createKafkaLogger } from './constants';
import { KafkaModuleAsyncOptions, KafkaModuleOptions } from './interfaces';
import { KafkaAdmin } from './kafka.admin';
import { KafkaConsumer } from './kafka.consumer';
import { KafkaProducer } from './kafka.producer';

@Module({})
export class KafkaModule {
  static register({ global, producer, admin, consumer, ...kafkaOptions }: KafkaModuleOptions): DynamicModule {
    const kafka = new Kafka({ ...kafkaOptions, logCreator: createKafkaLogger });
    const providers: Array<Type<any> | Provider> = [];

    if (producer?.use) {
      providers.push({
        provide: KafkaProducer,
        useFactory() {
          return new KafkaProducer(kafka, producer);
        },
      });
    }

    if (admin?.use) {
      providers.push({
        provide: KafkaAdmin,
        useFactory() {
          return new KafkaAdmin(kafka, admin);
        },
      });
    }

    if (consumer) {
      providers.push({
        inject: [EventEmitter2],
        provide: KafkaConsumer,
        useFactory(eventEmitter: EventEmitter2) {
          return new KafkaConsumer(kafka, consumer, eventEmitter);
        },
      });
    }

    const dynamicModule: DynamicModule = {
      global,
      imports: [EventEmitterModule.forRoot({ global: false })],
      module: KafkaModule,
    };

    if (providers.length > 0) {
      dynamicModule.providers = providers;
      dynamicModule.exports = providers;
    }

    return dynamicModule;
  }

  static async registerAsync(moduleAsyncOptions: KafkaModuleAsyncOptions): Promise<DynamicModule> {
    return this.register(await moduleAsyncOptions.useFactory(...moduleAsyncOptions.inject));
  }
}
