import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class HelloResult {
  @Field()
  result: string;
}

@Resolver()
export class HelloResolver {
  @Query(() => HelloResult)
  sayHello(): HelloResult {
    return { result: "ok" };
  }
}
