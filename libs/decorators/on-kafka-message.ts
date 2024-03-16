import { KafkaMetadataKey } from './enums';
import { extractKafkaMessageParamMetadata } from './kafka-params';
import { OnKafkaHandlerReturnType } from './types';
import { createKafkaMessageEvent, emitter } from '../constants';
import { KafkaMessagePayload } from '../implements';

export const OnKafkaMessage = (topic: string): MethodDecorator => {
  return (target: unknown, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const contextHandler = descriptor.value;
    const emitterHandler = async function (messagePayload: KafkaMessagePayload) {
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

    emitter.on(createKafkaMessageEvent(topic), emitterHandler);
  };
};
