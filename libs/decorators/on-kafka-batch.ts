import { applyDecorators } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { KafkaMetadataKey } from './enums';
import { extractKafkaBatchParamMetadata } from './kafka-params';
import { OnKafkaContextType, OnKafkaHandlerReturnType } from './types';
import { createKafkaBatchEvent } from '../constants';
import { KafkaBatchPayload } from '../implements';

export const OnKafkaBatch = (topic: string): MethodDecorator =>
  applyDecorators(
    OnEvent(createKafkaBatchEvent(topic)),
    (target: unknown, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      const handler = descriptor.value;
      const metadataKeys = Reflect.getOwnMetadataKeys(descriptor.value);
      const metadataValues = metadataKeys.map((key) => {
        return [key, Reflect.getMetadata(key, descriptor.value)];
      });

      descriptor.value = async function (batchPayload: KafkaBatchPayload) {
        const handlerArgs = [];

        for (const param of extractKafkaBatchParamMetadata(target)) {
          switch (param.metadataKey) {
            case KafkaMetadataKey.BatchPayloadParam:
              handlerArgs.push(batchPayload);
              break;

            case KafkaMetadataKey.BatchParam:
              handlerArgs.push(batchPayload.batch);
              break;

            case KafkaMetadataKey.BatchMessagesParam:
              handlerArgs.push(batchPayload.batch.messages);
              break;
          }
        }

        const context: OnKafkaContextType = {
          getClass: () => this.constructor,
          getHandler: () => handler,
        };

        const returnValue: OnKafkaHandlerReturnType = {
          context,
          value: null,
          error: null,
        };

        try {
          returnValue.value = await handler.apply(this)(...handlerArgs);
        } catch (e) {
          returnValue.error = e;
        }

        return returnValue;
      };

      metadataValues.forEach(([key, value]) => Reflect.defineMetadata(key, value, descriptor.value));
    },
  );
