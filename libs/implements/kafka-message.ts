import { IHeaders, Message } from 'kafkajs';

export class KafkaMessage {
  readonly key: string | null;
  readonly value: string;
  readonly headers: IHeaders | null;
  readonly partition: number | null;
  readonly timestamp: Date | null;

  constructor(message: Message) {
    this.key = message.key ? Buffer.from(message.key).toString('utf-8') : null;
    this.value = message.value ? Buffer.from(message.value).toString('utf-8') : null;
    this.headers = message.headers ?? null;
    this.partition = message.partition ?? null;
    this.timestamp = Number.isNaN(message.timestamp) ? null : new Date(Number(message.timestamp));
  }

  toJSON() {
    try {
      return JSON.parse(this.value);
    } catch {
      return null;
    }
  }
}
