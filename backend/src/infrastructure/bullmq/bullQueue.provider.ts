import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RedisConfig } from '../configuration/redis.config';

@Injectable()
export class BullQueueProvider {
  public myQueue: Queue;

  constructor(private readonly redisConfig: RedisConfig) {
    this.myQueue = new Queue('my-queue', {
    connection: this.redisConfig.getRedisClient(),
    });
    }

  async addJob(data: any) {
    await this.myQueue.add('my-job', data);
    console.log('Job added');
  }
}
