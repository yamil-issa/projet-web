import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Message } from 'src/entities/message.entity';
import { SendMessageMutation } from 'src/mutations/message/sendMessage';
import { BullQueueProvider } from 'src/infrastructure/bullmq/bullQueue.provider';

@Resolver()
export class MessageResolver {
  private messages = [
        {
            id: 1,
            content: 'Hello Jane',
            createdAt: '2024-05-01T12:00:00Z',
            author: {
                id: 1,
                username: 'john_doe',
                email: 'doe@gmail.com',
                password: '123',
                conversations: [],
            },
        },
    ];

  @Query(() => Message)
  message(@Args('id', { type: () => Int }) id: number): Message | null{
   // Fetch message by id
   return this.messages.find((message) => message.id === id) || null;
  }

}
