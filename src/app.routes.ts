import { Routes } from '@nestjs/core';
import { HealthCheckModule } from './healthCheck.module';

export const routes: Routes = [
    {
        path: '/',
        module: HealthCheckModule,
    },
];
