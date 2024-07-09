import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RedisConfig } from 'src/infrastructure/configuration/redis.config';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisConfig: RedisConfig,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const redisClient = this.redisConfig.getRedisClient();
    const users = await redisClient.hvals('users');
    const user = users.map(u => JSON.parse(u)).find(u => u.email === email);

    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return {
      ...user,
      token,
    };
  }

  async signup(user: any) {
    console.log('Signup method called');
    const redisClient = this.redisConfig.getRedisClient();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const users = await redisClient.hgetall('users');
    const newUserId = Object.keys(users).length + 1;

    const newUser: User = {
      id: newUserId,
      username: user.username,
      email: user.email,
      password: hashedPassword,
      conversationIds: [],
      token: '',
    };

    await redisClient.hset('users', newUser.id.toString(), JSON.stringify(newUser));

    const payload = { email: newUser.email, sub: newUser.id };
    const token = this.jwtService.sign(payload);
    newUser.token = token;

    console.log('Generated token:', token);

    await redisClient.hset('users', newUser.id.toString(), JSON.stringify(newUser));

    console.log('New user created:', newUser);
    return newUser;
  }
}
