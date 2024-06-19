import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisConfig {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null,
    });

    this.testConnection();
  }

  private async testConnection() {
    try {
      const response = await this.redisClient.ping();
      console.log('Redis connection successful:', response);
    } catch (error) {
      console.error('Redis connection error:', error);
    }
  }

  getRedisClient(): Redis {
    return this.redisClient;
  }
}