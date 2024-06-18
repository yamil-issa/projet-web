import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user.entity';
import { Message } from './message.entity';

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
