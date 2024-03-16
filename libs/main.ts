import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { KafkaMessageParam, OnKafkaMessage } from './decorators';
import { KafkaModule } from './kafka.module';
import { KafkaProducer } from './kafka.producer';

@Module({
  imports: [
    KafkaModule.register({
      clientId: 'KAFKA_CLIENT',
      brokers: ['localhost:29092'],
      producer: {
        allowAutoTopicCreation: true,
      },
      consumer: {
        groupId: 'KAFKA_CONSUMER',
        subscriptions: { topics: ['message'] },
      },
    }),
  ],
})
class AppModule {
  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async onApplicationBootstrap() {
    await this.kafkaProducer.send({
      topic: 'message',
      messages: [{ value: 'hello' }],
    });
  }

  @OnKafkaMessage('message')
  async handleMessage(@KafkaMessageParam() message1: any, @KafkaMessageParam() message2: any) {
    console.log({ message1, message2 });
    return 'message';
  }
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  app.enableShutdownHooks();
}

bootstrap();
