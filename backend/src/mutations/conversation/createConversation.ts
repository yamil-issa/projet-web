import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Conversation } from 'src/entities/conversation.entity';
import { User } from 'src/entities/user.entity';
import { RedisConfig } from 'src/infrastructure/configuration/redis.config';

@Resolver()
export class CreateConversationMutation {
  constructor(private readonly redisConfig: RedisConfig) {}

  @Mutation(() => Conversation)
  async createConversation(
    @Args('userId1', { type: () => Int }) userId1: number,
    @Args('userId2', { type: () => Int }) userId2: number,
  ): Promise<Conversation> {
    const redisClient = this.redisConfig.getRedisClient();

    // Fetch users from Redis
    const user1Data = await redisClient.hget('users', userId1.toString());
    const user2Data = await redisClient.hget('users', userId2.toString());

    if (!user1Data || !user2Data) {
      throw new Error('User not found');
    }

    const user1: User = JSON.parse(user1Data);
    const user2: User = JSON.parse(user2Data);

    // Generate new conversation ID
    const newConversationId = await redisClient.incr('conversation_id_counter');

    // Create new conversation
    const newConversation: Conversation = {
      id: newConversationId,
      participants: [user1, user2],
      messages: [],
      startedAt: new Date().toISOString(),
    };

    // Store conversation in Redis
    await redisClient.hset('conversations', newConversation.id.toString(), JSON.stringify(newConversation));

    // Update users' conversations in Redis
    user1.conversationIds.push(newConversation.id);
    user2.conversationIds.push(newConversation.id);
    await redisClient.hset('users', userId1.toString(), JSON.stringify(user1));
    await redisClient.hset('users', userId2.toString(), JSON.stringify(user2));

    return newConversation;
  }
}
