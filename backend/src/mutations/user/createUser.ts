import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RedisConfig } from 'src/infrastructure/configuration/redis.config';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Resolver()
export class CreateUserMutation {
  constructor(private readonly redisConfig: RedisConfig) {}

  @Mutation(() => User)
  async createUser(
    @Args('username', { type: () => String }) username: string,
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string,
  ): Promise<User> {
    const redisClient = this.redisConfig.getRedisClient();

    // Retrieve all users
    const users = await redisClient.hgetall('users');
    const newUserId = Object.keys(users).length + 1;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: newUserId,
      username: username,
      email: email,
      password: hashedPassword,
      conversationIds: [],
    };

    // Store user in Redis
    await redisClient.hset('users', newUser.id.toString(), JSON.stringify(newUser));

    return newUser;
  }
}
