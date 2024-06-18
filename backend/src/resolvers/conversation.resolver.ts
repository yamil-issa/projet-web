import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Conversation } from 'src/graphql/entities/conversation.entity';
import { Message } from 'src/graphql/entities/message.entity';

@Resolver()
export class ConversationResolver {
  // array of conversations
  private conversationsArray = [
    {
      id: 1,
      participants: [
        {
          id: 1,
          username: 'john_doe',
          email: 'doe@gmail.com',
          password: '123',
          conversations: []
        },
        {
          id: 2,
          username: 'jane_doe',
          email: 'jane@gmail.com',
          password: '456',
          conversations: []
        },
      ],
      messages: [
        {
          id: 1,
          content: 'Hello Jane',
          createdAt: '2024-05-01T12:00:00Z',
          author: {
            id: 1,
            username: 'john_doe',
            email: 'doe@gmail.com',
            password: '123',
            conversations: []
          },
        },
      ],
      startedAt: '2024-05-01T12:00:00Z',
    },
  ];

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

}
