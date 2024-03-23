import { Injectable } from '@nestjs/common';

import { KafkaProducer } from '../../kafka.producer';

@Injectable()
export class ProducerService {
  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async sendMessageTopicOne() {
    await this.kafkaProducer.send({
      topic: 'message-topic-1',
      messages: [{ value: Buffer.from('hi, message topic 1') }],
    });
  }

  async sendMessageTopicTwo() {
    await this.kafkaProducer.send({
      topic: 'message-topic-2',
      messages: [{ value: 'hi, message topic 2' }],
    });
  }

  async sendMessageTopicThree() {
    await this.kafkaProducer.send({
      topic: 'message-topic-3',
      messages: [{ value: JSON.stringify({ message: 'hi, message topic 3' }) }],
    });
  }
}
