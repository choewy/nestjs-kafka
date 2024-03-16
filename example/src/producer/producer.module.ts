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
