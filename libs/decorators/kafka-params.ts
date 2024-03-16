import { KafkaMetadataKey } from './enums';
import { KafkaParamMetadataType } from './types';

export const KafkaMessagePayloadParam = (): ParameterDecorator => (target, _propertyKey, parameterIndex) => {
  const metadataKey = KafkaMetadataKey.MessagePayloadParam;
  const metadataValue: KafkaParamMetadataType = {
    metadataKey,
    parameterIndex,
  };

  Reflect.defineMetadata(metadataKey, (Reflect.getMetadata(metadataKey, target) ?? []).concat(metadataValue), target);
};

export const KafkaMessageParam = (): ParameterDecorator => (target, _propertyKey, parameterIndex) => {
  const metadataKey = KafkaMetadataKey.MessageParam;
  const metadataValue: KafkaParamMetadataType = {
    metadataKey,
    parameterIndex,
  };

  Reflect.defineMetadata(metadataKey, (Reflect.getMetadata(metadataKey, target) ?? []).concat(metadataValue), target);
};

export const KafkaBatchPayloadParam = (): ParameterDecorator => (target, _propertyKey, parameterIndex) => {
  const metadataKey = KafkaMetadataKey.BatchPayloadParam;
  const metadataValue: KafkaParamMetadataType = {
    metadataKey,
    parameterIndex,
  };

  Reflect.defineMetadata(metadataKey, (Reflect.getMetadata(metadataKey, target) ?? []).concat(metadataValue), target);
};

export const KafkaBatchParam = (): ParameterDecorator => (target, _propertyKey, parameterIndex) => {
  const metadataKey = KafkaMetadataKey.BatchParam;
  const metadataValue: KafkaParamMetadataType = {
    metadataKey,
    parameterIndex,
  };

  Reflect.defineMetadata(metadataKey, (Reflect.getMetadata(metadataKey, target) ?? []).concat(metadataValue), target);
};

export const KafkaBatchMessagesParam = (): ParameterDecorator => (target, _propertyKey, parameterIndex) => {
  const metadataKey = KafkaMetadataKey.BatchMessagesParam;
  const metadataValue: KafkaParamMetadataType = {
    metadataKey,
    parameterIndex,
  };

  Reflect.defineMetadata(metadataKey, (Reflect.getMetadata(metadataKey, target) ?? []).concat(metadataValue), target);
};

export const extractKafkaMessageParamMetadata = (target: unknown) => {
  const paramsMetadatas: Array<KafkaParamMetadataType<KafkaMetadataKey.MessagePayloadParam | KafkaMetadataKey.MessageParam>> = []
    .concat(Reflect.getMetadata(KafkaMetadataKey.MessageParam, target) ?? [])
    .concat(Reflect.getMetadata(KafkaMetadataKey.MessagePayloadParam, target) ?? [])
    .sort((x, y) => x.parameterIndex - y.parameterIndex);

  return paramsMetadatas;
};

export const extractKafkaBatchParamMetadata = (target: unknown) => {
  const paramsMetadatas: Array<
    KafkaParamMetadataType<KafkaMetadataKey.BatchPayloadParam | KafkaMetadataKey.BatchMessagesParam | KafkaMetadataKey.BatchParam>
  > = []
    .concat(Reflect.getMetadata(KafkaMetadataKey.BatchPayloadParam, target) ?? [])
    .concat(Reflect.getMetadata(KafkaMetadataKey.BatchParam, target) ?? [])
    .concat(Reflect.getMetadata(KafkaMetadataKey.BatchMessagesParam, target) ?? [])
    .sort((x, y) => x.parameterIndex - y.parameterIndex);

  return paramsMetadatas;
};
