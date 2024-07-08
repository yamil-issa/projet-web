import { Injectable } from "@nestjs/common";
import { Args, Int, Mutation } from "@nestjs/graphql";
import { Message } from "src/entities/message.entity";
import { BullQueueProvider } from "src/infrastructure/bullmq/bullQueue.provider";
import { MessageDTO } from "./message.dto";
import { RedisConfig } from "src/infrastructure/configuration/redis.config";
import { User } from "src/entities/user.entity";
import { Conversation } from "src/entities/conversation.entity";

@Injectable()
export class SendMessageMutation {

  constructor(
    private readonly bullQueueProvider: BullQueueProvider,
    private readonly redisConfig: RedisConfig) {}

  @Mutation(() => Message)
  async sendMessage(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('conversationId', { type: () => Int }) conversationId: number,
    @Args('content', { type: () => String }) content: string,
  ): Promise<Message> {
    const redisClient = this.redisConfig.getRedisClient();

    // Fetch user from Redis
    const user = await redisClient.hget('users', userId.toString());
    if (!user) {
      throw new Error('User not found');
    }
    const parsedUser: User = JSON.parse(user);

    // Fetch conversation from Redis
    const conversation = await redisClient.hget('conversations', conversationId.toString());
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    const parsedConversation: Conversation = JSON.parse(conversation);
    const messages = await redisClient.hgetall('messages');
    const newMessageId = Object.keys(messages).length + 1;

    const newMessage: Message = {
      id: newMessageId,
      content: content,
      createdAt: new Date().toISOString(),
      author: parsedUser,
    };

    const newMessageDTO: MessageDTO = {
        id: newMessage.id,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        authorId: parsedUser.id,
      };
      
    // Add message to the queue
    await this.bullQueueProvider.addJob({
        message: newMessageDTO,
        conversationId: conversationId
    });
    

    return newMessage;
  }
}
