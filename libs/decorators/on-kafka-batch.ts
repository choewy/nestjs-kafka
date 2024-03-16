import { KafkaMetadataKey } from './enums';
import { extractKafkaBatchParamMetadata } from './kafka-params';
import { OnKafkaHandlerReturnType } from './types';
import { createKafkaBatchEvent, emitter } from '../constants';
import { KafkaBatchPayload } from '../implements';

export const OnKafkaBatch = (topic: string): MethodDecorator => {
  return (target: unknown, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const contextHandler = descriptor.value;
    const emitterHandler = async function (batchPayload: KafkaBatchPayload) {
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

      const returnValue: OnKafkaHandlerReturnType = {
        handler: contextHandler.name,
        value: null,
        error: null,
      };

      try {
        returnValue.value = await contextHandler(...handlerArgs);
      } catch (e) {
        returnValue.error = e;
      }

      return returnValue;
    };

    emitter.on(createKafkaBatchEvent(topic), emitterHandler);
  };
};
