import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Conversation } from './conversation.entity';


@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [Conversation])
  conversations: Conversation[];
}