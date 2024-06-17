import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { routes } from './app.routes';
import { HealthCheckModule } from './healthCheck.module';

@Module({
    exports: [RouterModule],
    imports: [RouterModule.register(routes), HealthCheckModule],
})
export class AppRoutingModule {}
