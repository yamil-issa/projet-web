import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { RedisConfig } from '../infrastructure/configuration/redis.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserInput, LoginUserInput } from '../entities/user.input';
import { Conversation } from 'src/entities/conversation.entity';
import { Request } from 'express';


@Resolver()
export class UserResolver {
  constructor(
    private readonly redisConfig: RedisConfig,
    private readonly authService: AuthService,
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
  async userConversations(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: { req: Request },
  ): Promise<Conversation[]> {
    const req = context.req;
    const user = (req as any).user as User;

    if (user.id !== id) {
      throw new UnauthorizedException('You can only access your own conversations');
    }

    const redisClient = this.redisConfig.getRedisClient();
    const userData = await redisClient.hget('users', id.toString());

    if (!userData) {
      return [];
    }

    const userEntity: User = JSON.parse(userData);
    const conversations = await Promise.all(userEntity.conversationIds.map(async (convId) => {
      const convData = await redisClient.hget('conversations', convId.toString());
      return convData ? JSON.parse(convData) : null;
    }));

    return conversations.filter(conv => conv !== null);
  }


  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const { username, email, password } = createUserInput;
    return this.authService.signup({ username, email, password });
  }

  @Mutation(() => User)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<User> {
    const { email, password } = loginUserInput;
    return this.authService.login({ email, password });
  }
}