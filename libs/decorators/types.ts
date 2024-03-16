export type OnKafkaHandlerReturnType<T = any> = {
  handler: string;
  value: T | null;
  error: Error | null;
};

export type KafkaParamMetadataType<MetadataKey = string> = {
  metadataKey: MetadataKey;
  parameterIndex: number;
};
