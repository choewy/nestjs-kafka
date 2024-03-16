import { KafkaProducer } from '@choewy/nestjs-kafka';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProducerService {
  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async sendHello() {
    await this.kafkaProducer.send({
      topic: 'topic-1',
      messages: [{ value: 'hello' }],
    });
  }
}
