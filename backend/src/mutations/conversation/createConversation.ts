import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Conversation } from '../../entities/conversation.entity';
import { User } from '../../entities/user.entity';
import { RedisConfig } from '../../infrastructure/configuration/redis.config';

@Resolver()
export class CreateConversationMutation {
  constructor(private readonly redisConfig: RedisConfig) {}

  @Mutation(() => Conversation)
  async createConversation(
    @Args('userId1', { type: () => Int }) userId1: number,
    @Args('userId2', { type: () => Int }) userId2: number,
  ): Promise<Conversation> {
    console.log('Creating conversation between users:', userId1, userId2);
    const redisClient = this.redisConfig.getRedisClient();

    // Fetch users from Redis
    const notParsedUser1 = await redisClient.hget('users', userId1.toString());
    const notParsedUser2 = await redisClient.hget('users', userId2.toString());

    if (!notParsedUser1 || !notParsedUser2) {
      throw new Error('User not found');
    }

    const user1: User = JSON.parse(notParsedUser1);
    const user2: User = JSON.parse(notParsedUser2);

    // Ensure conversationIds is an array
    user1.conversationIds = user1.conversationIds || [];
    user2.conversationIds = user2.conversationIds || [];

    // Retrieve all conversations
    const conversations = await redisClient.hgetall('conversations');
    const newConversationId = Object.keys(conversations).length + 1;

    const newConversation: Conversation = {
      id: newConversationId,
      participantIds: [user1.id, user2.id],
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
