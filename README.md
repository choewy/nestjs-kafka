# NestJS Kafka

## Installing

```bash
npm i @choewy/nestjs-kafka
```

> `app.enableShutdownHooks()` is essential when using the consumer

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
      producer: { allowAutoTopicCreation: true },
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
