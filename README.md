# NestJS Kafka

## Installing

```bash
npm i @choewy/nestjs-kafka
```

> `app.enableShutdownHooks()` is essential when using the consumer

## Options

### Kafka Producer Options

```ts
import { ProducerConfig } from 'kafkajs';

export interface KafkaProducerOptions extends ProducerConfig {
  use: boolean;
  logging?: boolean;
}
```

### Kafka Admin Options

```ts
import { AdminConfig } from 'kafkajs';

export interface KafkaAdminOptions extends AdminConfig {
  use: boolean;
}
```

### Kafka Consumer Options

```ts
import { ConsumerConfig, ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';

export interface KafkaConsumerOptions extends ConsumerConfig {
  subscriptions?: ConsumerSubscribeTopics;
  runOptions?: Omit<ConsumerRunConfig, 'eachMessage' | 'eachBatch'>;
  logging?: boolean;
}
```

### Kafka Module Options

```ts
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
```

## Uses

### Producer

```ts
import { Module } from '@nestjs/common';
import { KafkaModule } from '@choewy/nestjs-kafka';

@Module({
  import: [
    KafkaModule.register({
      producer: { use: true },
    }),
  ],
})
export class AppModule {}
```

### Consumer

```ts
import { Module, OnModuleInit } from '@nestjs/common';
import { KafkaModule, KafkaConsumer } from '@choewy/nestjs-kafka';

@Module({
  import: [
    KafkaModule.register({
      clientId: 'app-1',
      consumer: { groupId: 'group-1' },
    }),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly consumer: KafkaConsumer) {}

  async onModuleInit() {
    await this.consumer.subscribe({ topics: ['topic-1', 'topic-2'] });
    await this.consumer.run();
  }
}
```

KafkaConsumer can subscribe topics without `OnModuleInit` using the `consumer.subscriptions` option.

```ts
import { Module } from '@nestjs/common';
import { KafkaModule, KafkaConsumer } from '@choewy/nestjs-kafka';

@Module({
  import: [
    KafkaModule.register({
      clientId: 'app-1',
      consumer: {
        groupId: 'group-1',
        subscriptions: { topics: ['topic-1', 'topic-2'] },
      },
    }),
  ],
})
export class AppModule {}
```

## Example

### Run kafak with docker

```bash
npm run docker
```

### Run Nest.js Application

```bash
cd example

npm run start:dev
```

```ts
/** @filename example/src/producer/producer.module.ts */

import { Module } from '@nestjs/common';
import { KafkaModule } from '@choewy/nestjs-kafka';

import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';

@Module({
  imports: [
    KafkaModule.register({
      clientId: 'kafka-consumer',
      brokers: ['localhost:29092'],
      producer: { use: true, allowAutoTopicCreation: true },
    }),
  ],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}
```

```ts
/** @filename example/src/consumer/consumer.module.ts */

import { Module } from '@nestjs/common';
import { KafkaModule } from '@choewy/nestjs-kafka';

import { ConsumerService } from './consumer.service';

@Module({
  imports: [
    KafkaModule.register({
      clientId: 'kafka-consumer',
      brokers: ['localhost:29092'],
      consumer: {
        groupId: 'consumer-group-1',
        subscriptions: {
          topics: ['message-topic-1', 'message-topic-2', 'message-topic-3'],
        },
      },
    }),
  ],
  providers: [ConsumerService],
})
export class ConsumerModule {}
```

```bash
# send a message(Buffer("hi, message topic 1")) to message-topic-1
curl http://localhost:3000/producer/message/1

# send a message(String("hi, message topic 2")) to message-topic-2
curl http://localhost:3000/producer/message/2

# send a message(String('{"message": "hi, message topic 3"}')) to message-topic-3
curl http://localhost:3000/producer/message/3
```
