import { Controller, Get } from "@nestjs/common";
import { HealthCheckService } from "./healthCheck.service";
import { BullQueueProvider } from "src/infrastructure/bullmq/bullQueue.provider";

@Controller()
export class HealthCheckController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly bullQueueProvider: BullQueueProvider
  ) {}

  @Get()
  check(): string {
    return this.healthCheckService.check();
  }
  @Get('add-job')
  async addJob(): Promise<void> {
    await this.bullQueueProvider.addJob({ data: 'my-job' });
  }
}