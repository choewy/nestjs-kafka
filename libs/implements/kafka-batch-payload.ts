import { EachBatchPayload, Offsets, OffsetsByTopicPartition } from 'kafkajs';
import { KafkaBatch } from './kafka-batch';

export class KafkaBatchPayload {
  readonly batch: KafkaBatch;
  commitOffsetsIfNecessary: (offsets?: Offsets) => Promise<void>;
  heartbeat: () => Promise<void>;
  isRunning: () => boolean;
  isStale: () => boolean;
  pause: () => void;
  resolveOffset: (offset: string) => void;
  uncommittedOffsets: () => OffsetsByTopicPartition;

  constructor(eachBatchPayload: EachBatchPayload) {
    this.batch = new KafkaBatch(eachBatchPayload.batch);
    this.commitOffsetsIfNecessary = eachBatchPayload.commitOffsetsIfNecessary;
    this.heartbeat = eachBatchPayload.heartbeat;
    this.isRunning = eachBatchPayload.isRunning;
    this.isStale = eachBatchPayload.isStale;
    this.pause = eachBatchPayload.pause;
    this.resolveOffset = eachBatchPayload.resolveOffset;
    this.uncommittedOffsets = eachBatchPayload.uncommittedOffsets;
  }
}
