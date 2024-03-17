import { Type } from '@nestjs/common';

export type OnKafkaContextType = {
  getClass(): Type<any> | null;
  getHandler(): Type<any> | null;
};

export type OnKafkaHandlerReturnType<T = any> = {
  context: OnKafkaContextType;
  value: T | null;
  error: Error | null;
};

export type KafkaParamMetadataType<MetadataKey = string> = {
  metadataKey: MetadataKey;
  parameterIndex: number;
};
