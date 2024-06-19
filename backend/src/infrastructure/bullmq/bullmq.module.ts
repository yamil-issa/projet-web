import { Module } from '@nestjs/common';
import { BullQueueProvider } from './bullQueue.provider';
import { BullConsumerProvider } from './bullConsumer.provider';
import { RedisConfigModule } from '../configuration/redis.config.module';

@Module({
  imports: [RedisConfigModule],
  providers: [BullQueueProvider, BullConsumerProvider],
  exports: [BullQueueProvider],
})
export class BullMqModule {}
