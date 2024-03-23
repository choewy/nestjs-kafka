import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KAFKA_CONFIG, KafkaConfig } from './configs/kafka.config';
import { ConsumerModule } from './consumer/consumer.module';
import { ProducerModule } from './producer/producer.module';
import { KafkaModule } from '../kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [KafkaConfig],
    }),
    KafkaModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get(KAFKA_CONFIG);
      },
    }),
    ProducerModule,
    ConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
