import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { createKafkaLogger } from './constants';
import { KafkaModuleAsyncOptions, KafkaModuleOptions } from './interfaces';
import { KafkaProducer } from './kafka.producer';
import { KafkaConsumer } from './kafka.consumer';
import { KafkaAdmin } from './kafka.admin';

@Module({})
export class KafkaModule {
  static register({ global, producer, consumer, admin, ...kafkaOptions }: KafkaModuleOptions): DynamicModule {
    const kafka = new Kafka({ ...kafkaOptions, logCreator: createKafkaLogger });
    const providers: Array<Type<any> | Provider> = [];

    if (producer) {
      providers.push({
        provide: KafkaProducer,
        useFactory() {
          return new KafkaProducer(kafka, producer);
        },
      });
    }

    if (consumer) {
      providers.push({
        provide: KafkaConsumer,
        useFactory() {
          return new KafkaConsumer(kafka, consumer);
        },
      });
    }

    if (admin) {
      providers.push({
        provide: KafkaAdmin,
        useFactory() {
          return new KafkaAdmin(kafka, admin);
        },
      });
    }

    const dynamicModule: DynamicModule = { global, module: KafkaModule };

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
