import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisConfig } from 'src/infrastructure/configuration/redis.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly redisConfig: RedisConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'default_secret',
    });
  }

  async validate(payload: any) {
    const redisClient = this.redisConfig.getRedisClient();
    const user = await redisClient.hget('users', payload.sub.toString());
    return user ? JSON.parse(user) : null;
  }
}
