import { Module } from '@nestjs/common';
import { BullQueueProvider } from './bullQueue.provider';
import { BullConsumerProvider } from './bullConsumer.provider';

@Module({
  providers: [BullQueueProvider, BullConsumerProvider],
  exports: [BullQueueProvider],
})
export class BullMqModule {}
