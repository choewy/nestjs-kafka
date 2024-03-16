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
