import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Worker } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class BullConsumerProvider implements OnModuleInit, OnModuleDestroy {
  private connection: Redis;
  private worker: Worker;

  constructor() {
    this.connection = new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null
    });
  }

  onModuleInit() {
    this.worker = new Worker('my-queue', async job => {
      if (job) {
        console.log('Processing job:', job.data);
        this.worker.on('completed', job => {
            console.log(`Job with ID ${job?.id} has been completed`);
          });
      
          this.worker.on('failed', (job, err) => {
            console.log(`Job with ID ${job?.id} has failed with error ${err.message}`); 
          });
      }
    }, { connection: this.connection });
  }

  onModuleDestroy() {
    this.worker.close();
  }
}
