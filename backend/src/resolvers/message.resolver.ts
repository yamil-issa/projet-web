import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Message } from '../entities/message.entity';
import { RedisConfig } from '../infrastructure/configuration/redis.config';

@Resolver()
export class MessageResolver {
  constructor(private readonly redisConfig: RedisConfig) {}

  @Query(() => Message, { nullable: true })
  async message(@Args('id', { type: () => Int }) id: number): Promise<Message | null> {
    const redisClient = this.redisConfig.getRedisClient();
    
    // Fetch message by id from Redis
    const messageData = await redisClient.hget('messages', id.toString());
    
    return messageData ? JSON.parse(messageData) : null;
  }
}
