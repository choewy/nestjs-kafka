import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { KafkaModule } from '@choewy/nestjs-kafka';
import { ProducerController } from './producer.controller';

@Module({
  imports: [
    KafkaModule.register({
      clientId: 'kafka-producer',
      brokers: ['localhost:29092'],
      producer: { allowAutoTopicCreation: true },
    }),
  ],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}
