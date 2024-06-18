import { Module } from '@nestjs/common';
import { AppRoutingModule } from './app.routing-module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { HelloModule } from './hello.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    AppRoutingModule,
    HelloModule
  ],
})
export class AppModule {}
