import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Admin, AdminConfig, Kafka } from 'kafkajs';

@Injectable()
export class KafkaAdmin implements Omit<Admin, 'logger'>, OnModuleInit, OnModuleDestroy {
  private readonly admin: Admin;

  constructor(
    private readonly kafka: Kafka,
    private readonly options: AdminConfig,
  ) {
    this.admin = this.kafka.admin(this.options);
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  get connect() {
    return this.admin.connect;
  }

  get disconnect() {
    return this.admin.disconnect;
  }

  get listTopics() {
    return this.admin.listTopics;
  }

  get createTopics() {
    return this.admin.createTopics;
  }

  get deleteTopics() {
    return this.admin.deleteTopics;
  }

  get createPartitions() {
    return this.admin.createPartitions;
  }

  get fetchTopicMetadata() {
    return this.admin.fetchTopicMetadata;
  }

  get fetchOffsets() {
    return this.admin.fetchOffsets;
  }

  get fetchTopicOffsets() {
    return this.admin.fetchTopicOffsets;
  }

  get fetchTopicOffsetsByTimestamp() {
    return this.admin.fetchTopicOffsetsByTimestamp;
  }

  get describeCluster() {
    return this.admin.describeCluster;
  }

  get setOffsets() {
    return this.admin.setOffsets;
  }

  get resetOffsets() {
    return this.admin.resetOffsets;
  }

  get describeConfigs() {
    return this.admin.describeConfigs;
  }

  get alterConfigs() {
    return this.admin.alterConfigs;
  }

  get listGroups() {
    return this.admin.listGroups;
  }

  get deleteGroups() {
    return this.admin.deleteGroups;
  }

  get describeGroups() {
    return this.admin.describeGroups;
  }

  get describeAcls() {
    return this.admin.describeAcls;
  }

  get deleteAcls() {
    return this.admin.deleteAcls;
  }

  get createAcls() {
    return this.admin.createAcls;
  }

  get deleteTopicRecords() {
    return this.admin.deleteTopicRecords;
  }

  get alterPartitionReassignments() {
    return this.admin.alterPartitionReassignments;
  }

  get listPartitionReassignments() {
    return this.admin.listPartitionReassignments;
  }

  get on() {
    return this.admin.on;
  }

  get events() {
    return this.admin.events;
  }
}
