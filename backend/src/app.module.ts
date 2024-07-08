import { Module } from '@nestjs/common';
import { AppRoutingModule } from './app.routing-module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GraphqlModule } from './graphql/graphql.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RedisConfigModule } from './infrastructure/configuration/redis.config.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      path: '/api',
    }),
    AppRoutingModule,
    RedisConfigModule,
    GraphqlModule,
   
  ],
})
export class AppModule {}
