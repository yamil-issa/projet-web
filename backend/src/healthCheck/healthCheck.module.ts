import { Module } from '@nestjs/common';
import { HealthCheckController } from './healthCheck.controller';
import { HealthCheckService } from 'src/healthCheck/healthCheck.service';
import { BullMqModule } from 'src/infrastructure/bullmq/bullmq.module';

@Module({
  imports: [BullMqModule],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
})
export class HealthCheckModule {}
