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
  static forRoot({ producer, admin, consumer, ...kafkaOptions }: KafkaModuleOptions): DynamicModule {
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
      imports: [EventEmitterModule.forRoot({ global: false })],
      module: KafkaModule,
    };

    if (providers.length > 0) {
      dynamicModule.providers = providers;
      dynamicModule.exports = providers;
    }

    return dynamicModule;
  }

  static async forRootAsync(moduleAsyncOptions: KafkaModuleAsyncOptions): Promise<DynamicModule> {
    const providers: Provider[] = [
      {
        inject: [...moduleAsyncOptions.inject],
        provide: KafkaAdmin,
        async useFactory(...injects) {
          const options = await moduleAsyncOptions.useFactory(...injects);

          if (options.admin?.use) {
            return new KafkaAdmin(new Kafka({ ...options, logCreator: createKafkaLogger }), options.admin);
          }
        },
      },
      {
        inject: moduleAsyncOptions.inject,
        provide: KafkaProducer,
        async useFactory(...injects) {
          const options = await moduleAsyncOptions.useFactory(...injects);

          if (options.producer?.use) {
            return new KafkaProducer(new Kafka({ ...options, logCreator: createKafkaLogger }), options.producer);
          }
        },
      },
      {
        inject: [EventEmitter2, ...moduleAsyncOptions.inject],
        provide: KafkaConsumer,
        async useFactory(eventEmitter: EventEmitter2, ...injects) {
          const options = await moduleAsyncOptions.useFactory(...injects);

          if (options.consumer) {
            return new KafkaConsumer(new Kafka({ ...options, logCreator: createKafkaLogger }), options.consumer, eventEmitter);
          }
        },
      },
    ];

    return {
      global: true,
      imports: [EventEmitterModule.forRoot({ global: false })],
      module: KafkaModule,
      providers,
      exports: providers,
    };
  }
}
