import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { conversationsArray } from 'src/data';
import { CreateConversationMutation } from 'src/mutations/conversation/createConversation';
import { SendMessageMutation } from 'src/mutations/message/sendMessage';
import { BullQueueProvider } from 'src/infrastructure/bullmq/bullQueue.provider'; 

@Resolver()
export class ConversationResolver {
  private conversationsArray = conversationsArray;

  constructor(
    private readonly sendMessageMutation: SendMessageMutation,
    private readonly bullQueueProvider: BullQueueProvider
  ) {}

  @Query(() => Conversation)
  conversation(@Args('id', { type: () => Int }) id: number): Conversation | null{
    // Fetch conversation by id
    return this.conversationsArray.find((conversation) => conversation.id === id) || null;
  }

  // Query to get all conversations
  @Query(() => [Conversation])
    conversations(): Conversation[] {
        return this.conversationsArray;
    }

  // Query to get all messages of a conversation
  @Query(() => [Message])
    conversationMessages(@Args('id', { type: () => Int }) id: number): Message[] {
        // Fetch conversation by id
        const conversation = this.conversationsArray.find((conversation) => conversation.id === id);
        if (!conversation) {
            return [];
        }
        return conversation.messages;
    }
  
  @Mutation(() => Conversation)
  createConversation(
    @Args('userId1', { type: () => Int }) userId1: number,
    @Args('userId2', { type: () => Int }) userId2: number,
  ): Promise<Conversation> {
    const createConversationMutation = new CreateConversationMutation();
    return createConversationMutation.createConversation(userId1, userId2);
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
