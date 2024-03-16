import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get('1')
  async sendMessageTopicOne(): Promise<void> {
    return this.producerService.sendMessageTopicOne();
  }

  @Get('2')
  async sendMessageTopicTwo(): Promise<void> {
    return this.producerService.sendMessageTopicTwo();
  }

  @Get('3')
  async sendMessageTopicThree(): Promise<void> {
    return this.producerService.sendMessageTopicThree();
  }
}
