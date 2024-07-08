import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { RedisConfig } from '../configuration/redis.config';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';

@Injectable()
export class BullConsumerProvider implements OnModuleInit, OnModuleDestroy {
  private worker: Worker;

  constructor(private readonly redisConfig: RedisConfig) {}

  onModuleInit() {
    this.worker = new Worker('my-queue', async (job: Job) => {
      const { message, conversationId } = job.data;
      const redisClient = this.redisConfig.getRedisClient();

      try {
        const conversationData = await redisClient.hget('conversations', conversationId.toString());
        if (!conversationData) {
          throw new Error('Conversation not found');
        }
        const conversation: Conversation = JSON.parse(conversationData);

        const authorData = await redisClient.hget('users', message.authorId.toString());
        if (!authorData) {
          throw new Error('Author not found');
        }
        const author = JSON.parse(authorData);

        const newMessage: Message = {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          author: author,
        };

        // Store new message in Redis
        await redisClient.hset('messages', newMessage.id.toString(), JSON.stringify(newMessage));

        // Update conversation with new message
        conversation.messages.push(newMessage);
        await redisClient.hset('conversations', conversation.id.toString(), JSON.stringify(conversation));

        console.log('Processed job:', job.data);
      } catch (error) {
        console.error('Failed to process job:', job.id, error);
        throw error;
      }
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
