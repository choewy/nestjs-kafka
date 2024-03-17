import { applyDecorators } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { KafkaMetadataKey } from './enums';
import { extractKafkaMessageParamMetadata } from './kafka-params';
import { OnKafkaContextType, OnKafkaHandlerReturnType } from './types';
import { createKafkaMessageEvent } from '../constants';
import { KafkaMessagePayload } from '../implements';

export const OnKafkaMessage = (topic: string): MethodDecorator =>
  applyDecorators(
    OnEvent(createKafkaMessageEvent(topic)),
    (target: unknown, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      const handler = descriptor.value;
      const metadataKeys = Reflect.getOwnMetadataKeys(descriptor.value);
      const metadataValues = metadataKeys.map((key) => {
        return [key, Reflect.getMetadata(key, descriptor.value)];
      });

      descriptor.value = async function (messagePayload: KafkaMessagePayload) {
        const handlerArgs = [];

        for (const param of extractKafkaMessageParamMetadata(target)) {
          switch (param.metadataKey) {
            case KafkaMetadataKey.MessagePayloadParam:
              handlerArgs.push(messagePayload);
              break;

            case KafkaMetadataKey.MessageParam:
              handlerArgs.push(messagePayload.message);
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
          returnValue.value = await handler.bind(this)(...handlerArgs);
        } catch (e) {
          returnValue.error = e;
        }

        return returnValue;
      };

      metadataValues.forEach(([key, value]) => Reflect.defineMetadata(key, value, descriptor.value));
    },
  );
