import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';

@Injectable()
export class RedisConfig {
  private readonly redisClient: Redis;

  constructor() {
    dotenv.config();
    
    const redisHost = process.env.REDIS_HOST ?? 'redis';
    console.log(`Connecting to Redis at ${redisHost}:6379`);

    this.redisClient = new Redis({
      host: redisHost,
      port: 6379,
      maxRetriesPerRequest: null,
    });

    this.waitForRedis();
  }

  private async waitForRedis() {
    const maxRetries = 10;
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await this.redisClient.ping();
        console.log('Redis connection successful:', response);
        break;
      } catch (error) {
        retries++;
        console.error(`Redis connection attempt ${retries} failed:`, error);
        await new Promise(res => setTimeout(res, 5000));
      }
    }
    if (retries === maxRetries) {
      console.error('Could not connect to Redis after maximum retries.');
    }
  }

  getRedisClient(): Redis {
    return this.redisClient;
  }
}
