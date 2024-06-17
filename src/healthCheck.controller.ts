import { Controller, Get } from "@nestjs/common";
import { HealthCheckService } from "./healthCheck.service";

@Controller()
export class HealthCheckController {
    constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  check(): string {
    return this.healthCheckService.check();
  }
}