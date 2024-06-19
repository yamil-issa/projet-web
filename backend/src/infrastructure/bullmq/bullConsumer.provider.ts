import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { conversationsArray, usersArray } from 'src/graphql/data';
import { RedisConfig } from '../configuration/redis.config';
@Injectable()
export class BullConsumerProvider implements OnModuleInit, OnModuleDestroy {
  private worker: Worker;

  constructor(private readonly redisConfig: RedisConfig) {}

  onModuleInit() {
    this.worker = new Worker('my-queue', async (job: Job) => {
      const { message, conversationId } = job.data;
      const conversation = conversationsArray.find(conv => conv.id === conversationId);

      if (conversation) {
        const user = usersArray.find(u => u.id === message.authorId);
        const newMessage = {
          ...message,
          author: user,
        };
        conversation.messages.push(newMessage);
      }

      console.log('Processed job:', job.data);
    }, { connection: this.redisConfig.getRedisClient() });

    this.worker.on('completed', job => {
      console.log(`Job with ID ${job.id} has been completed`);
    });

    this.worker.on('failed', (job, err) => {
      console.log(`Job with ID ${job?.id} has failed with error ${err.message}`);
    });
  }

  onModuleDestroy() {
    this.worker.close();
  }
}
