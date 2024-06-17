import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckService {
  check(): string {
    return 'OK';
  }
}
