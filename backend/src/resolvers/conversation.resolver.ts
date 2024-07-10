import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { CreateConversationMutation } from '../mutations/conversation/createConversation';
import { SendMessageMutation } from '../mutations/message/sendMessage';
import { RedisConfig } from '../infrastructure/configuration/redis.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class ConversationResolver {
  constructor(
    private readonly redisConfig: RedisConfig,
    private readonly createConversationMutation: CreateConversationMutation,
    private readonly sendMessageMutation: SendMessageMutation,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => Conversation, { nullable: true })
  async conversation(@Args('id', { type: () => Int }) id: number): Promise<Conversation | null> {
    const redisClient = this.redisConfig.getRedisClient();
    const conversation = await redisClient.hget('conversations', id.toString());
    if (!conversation) {
      return null;
    }
    const parsedConversation = JSON.parse(conversation);
    return parsedConversation;
  }

  @Query(() => [Conversation])
  async conversations(): Promise<Conversation[]> {
    const redisClient = this.redisConfig.getRedisClient();
    const conversations = await redisClient.hvals('conversations');
    return conversations.map(conv => JSON.parse(conv));
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  async conversationMessages(@Args('id', { type: () => Int }) id: number): Promise<Message[]> {
    const redisClient = this.redisConfig.getRedisClient();
    const messages = await redisClient.hvals(`conversation:${id}:messages`);
    return messages.map(msg => JSON.parse(msg));
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Conversation)
  createConversation(
    @Args('userId1', { type: () => Int }) userId1: number,
    @Args('userId2', { type: () => Int }) userId2: number,
  ): Promise<Conversation> {
    return this.createConversationMutation.createConversation(userId1, userId2);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message)
  sendMessage(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('conversationId', { type: () => Int }) conversationId: number,
    @Args('content', { type: () => String }) content: string,
  ): Promise<Message> {
    return this.sendMessageMutation.sendMessage(userId, conversationId, content);
  }
}