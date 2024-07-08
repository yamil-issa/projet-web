import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Message } from './message.entity';

@ObjectType()
export class Conversation {
  @Field(() => Int)
  id: number;

  @Field(() => [Int])
  participantIds: number[];

  @Field(() => [Message])
  messages: Message[];

  @Field()
  startedAt: string;
}
