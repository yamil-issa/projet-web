import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class BullQueueProvider {
  private connection: Redis;
  public myQueue: Queue;

  constructor() {
    this.connection = new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null
    });

    this.myQueue = new Queue('my-queue', { connection: this.connection });
  }

  async addJob(data: any) {
    await this.myQueue.add('my-job', data);
    console.log('Job added');
  }
}
