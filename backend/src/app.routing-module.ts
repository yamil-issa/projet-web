import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { routes } from './app.routes';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
    exports: [RouterModule],
    imports: [RouterModule.register(routes), HealthCheckModule, GraphqlModule],
})
export class AppRoutingModule {}
