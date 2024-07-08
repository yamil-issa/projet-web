import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { CreateConversationMutation } from 'src/mutations/conversation/createConversation';
import { SendMessageMutation } from 'src/mutations/message/sendMessage';
import { RedisConfig } from 'src/infrastructure/configuration/redis.config';

@Resolver()
export class ConversationResolver {
  constructor(
    private readonly redisConfig: RedisConfig,
    private readonly createConversationMutation: CreateConversationMutation,
    private readonly sendMessageMutation: SendMessageMutation,
  ) {}

  @Query(() => Conversation)
  async conversation(@Args('id', { type: () => Int }) id: number): Promise<Conversation | null> {
    const redisClient = this.redisConfig.getRedisClient();
    const conversation = await redisClient.hget('conversations', id.toString());
    return conversation ? JSON.parse(conversation) : null;
  }

  @Query(() => [Conversation])
  async conversations(): Promise<Conversation[]> {
    const redisClient = this.redisConfig.getRedisClient();
    const conversations = await redisClient.hvals('conversations');
    return conversations.map(conv => {
      const parsedConversation = JSON.parse(conv);
      parsedConversation.participantIds = parsedConversation.participantIds || [];
      return parsedConversation;
    });
  }

  @Query(() => [Message])
  async conversationMessages(@Args('id', { type: () => Int }) id: number): Promise<Message[]> {
    const redisClient = this.redisConfig.getRedisClient();
    const messages = await redisClient.hvals(`conversation:${id}:messages`);
    return messages.map(msg => JSON.parse(msg));
  }

  @Mutation(() => Conversation)
  createConversation(
    @Args('userId1', { type: () => Int }) userId1: number,
    @Args('userId2', { type: () => Int }) userId2: number,
  ): Promise<Conversation> {
    return this.createConversationMutation.createConversation(userId1, userId2);
  }

  @Mutation(() => Message)
  sendMessage(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('conversationId', { type: () => Int }) conversationId: number,
    @Args('content', { type: () => String }) content: string,
  ): Promise<Message> {
    return this.sendMessageMutation.sendMessage(userId, conversationId, content);
  }
}
