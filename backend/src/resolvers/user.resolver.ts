import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Int, Args, Mutation } from '@nestjs/graphql';
import { Conversation } from 'src/entities/conversation.entity';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { RedisConfig } from 'src/infrastructure/configuration/redis.config';
import { CreateUserMutation } from 'src/mutations/user/createUser';

@Resolver()
export class UserResolver {
  constructor(
    private readonly redisConfig: RedisConfig,
    private readonly createUserMutation: CreateUserMutation,
  ) {}

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => Int }) id: number): Promise<User | null> {
    const redisClient = this.redisConfig.getRedisClient();
    const userData = await redisClient.hget('users', id.toString());
    return userData ? JSON.parse(userData) : null;
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    const redisClient = this.redisConfig.getRedisClient();
    const users = await redisClient.hvals('users');
    return users.map(user => JSON.parse(user));
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Conversation])
  async userConversations(@Args('id', { type: () => Int }) id: number): Promise<Conversation[]> {
    const redisClient = this.redisConfig.getRedisClient();
    const userData = await redisClient.hget('users', id.toString());

    if (!userData) {
      return [];
    }

    const user: User = JSON.parse(userData);
    const conversations = await Promise.all(user.conversationIds.map(async (convId) => {
      const convData = await redisClient.hget('conversations', convId.toString());
      return convData ? JSON.parse(convData) : null;
    }));

    return conversations.filter(conv => conv !== null);
  }

  @Mutation(() => User)
  createUser(
    @Args('username', { type: () => String }) username: string,
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string,
  ): Promise<User> {
    return this.createUserMutation.createUser(username, email, password);
  }
}
