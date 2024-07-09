import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Int, Mutation } from "@nestjs/graphql";
import { Message } from "../../entities/message.entity";
import { BullQueueProvider } from "../../infrastructure/bullmq/bullQueue.provider";
import { MessageDTO } from "./message.dto";
import { RedisConfig } from "../../infrastructure/configuration/redis.config";
import { User } from "../../entities/user.entity";
import { Conversation } from "../../entities/conversation.entity";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Injectable()
export class SendMessageMutation {

  constructor(
    private readonly bullQueueProvider: BullQueueProvider,
    private readonly redisConfig: RedisConfig) {}

  @UseGuards(JwtAuthGuard)
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

    // Generate new message ID
    const messages = await redisClient.hgetall(`conversation:${conversationId}:messages`);
    const newMessageId = Object.keys(messages).length + 1;

    // Create new message
    const newMessage: Message = {
      id: newMessageId,
      content: content,
      createdAt: new Date().toISOString(),
      author: parsedUser,
    };

    // Save the new message in Redis
    await redisClient.hset(`conversation:${conversationId}:messages`, newMessageId.toString(), JSON.stringify(newMessage));

    // Add message to the queue
    const newMessageDTO: MessageDTO = {
      id: newMessage.id,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      authorId: parsedUser.id,
    };
    await this.bullQueueProvider.addJob({
      message: newMessageDTO,
      conversationId: conversationId,
    });

    return newMessage;
  }
}
