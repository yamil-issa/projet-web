import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RedisConfig } from '../infrastructure/configuration/redis.config';
import { User } from '../entities/user.entity';

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

  async login(user: any) {
    const redisClient = this.redisConfig.getRedisClient();
    const users = await redisClient.hvals('users');
    const foundUser = users.map(u => JSON.parse(u)).find(u => u.email === user.email);

    if (!foundUser) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const payload = { email: foundUser.email, sub: foundUser.id };
    const token = this.jwtService.sign(payload);

    foundUser.token = token;

    await redisClient.hset('users', foundUser.id.toString(), JSON.stringify(foundUser));

    return foundUser;
  }

  async signup(user: any) {
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

    await redisClient.hset('users', newUser.id.toString(), JSON.stringify(newUser));

    return newUser;
  }
}