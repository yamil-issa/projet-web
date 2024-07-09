import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
