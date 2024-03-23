import { Injectable } from '@nestjs/common';

import { KafkaMessageParam, KafkaMessagePayloadParam, OnKafkaMessage } from '../../decorators';
import { KafkaMessage, KafkaMessagePayload } from '../../implements';

@Injectable()
export class ConsumerService {
  @OnKafkaMessage('message-topic-1')
  async onMessageTopicOne(@KafkaMessageParam() message: KafkaMessage) {
    /** @description process with message */
    console.log({ message });
  }

  @OnKafkaMessage('message-topic-2')
  async onMessageTopicTwo(@KafkaMessagePayloadParam() payload: KafkaMessagePayload) {
    /** @description process with payload */
    console.log({ payload });
  }

  @OnKafkaMessage('message-topic-3')
  async onMessageTopicThree(@KafkaMessageParam() message: KafkaMessage, @KafkaMessagePayloadParam() payload: KafkaMessagePayload) {
    /** @description process with message and payload */
    console.log({ message: message.toJSON(), payload });
  }
}
