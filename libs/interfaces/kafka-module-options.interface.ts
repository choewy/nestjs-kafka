import { ModuleMetadata } from '@nestjs/common';
import { KafkaConfig } from 'kafkajs';

import { KafkaAdminOptions } from './kafka-admin-options.interface';
import { KafkaConsumerOptions } from './kafka-consumer-options.interface';
import { KafkaProducerOptions } from './kafka-producer-options.interface';

export interface KafkaModuleOptions extends KafkaConfig {
  consumer?: KafkaConsumerOptions;
  producer?: KafkaProducerOptions;
  admin?: KafkaAdminOptions;
  global?: boolean;
}

export interface KafkaModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<KafkaModuleOptions> | KafkaModuleOptions;
}
