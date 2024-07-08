import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Message } from './message.entity';
import { User } from './user.entity';

@ObjectType()
export class Conversation {
  @Field(() => Int)
  id: number;

  @Field(() => [User])
  participants: User[];

  @Field(() => [Message])
  messages: Message[];

  @Field()
  startedAt: string;
}
