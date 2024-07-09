import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RedisConfig } from 'src/infrastructure/configuration/redis.config';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/infrastructure/auth/auth.service';

@Resolver()
export class CreateUserMutation {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => User)
  async createUser(
    @Args('username', { type: () => String }) username: string,
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string,
  ): Promise<User> {
    return this.authService.signup({ username, email, password });
  }
}
