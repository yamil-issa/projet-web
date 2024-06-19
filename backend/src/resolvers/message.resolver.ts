import { Resolver, Query, Args, Int} from '@nestjs/graphql';
import { Message } from '../entities/message.entity';
import { messagesArray } from '../data';

@Resolver()
export class MessageResolver {
  private messages = messagesArray;

  @Query(() => Message)
  message(@Args('id', { type: () => Int }) id: number): Message | null{
   // Fetch message by id
   return this.messages.find((message) => message.id === id) || null;
  }

}
