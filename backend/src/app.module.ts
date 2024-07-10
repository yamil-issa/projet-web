// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GraphqlModule } from './graphql/graphql.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RedisConfigModule } from './infrastructure/configuration/redis.config.module';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app.routing-module';
import { JwtModule } from '@nestjs/jwt';
import { MessagesGateway } from './infrastructure/gateways/messages.gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      path: '/api',
      context: ({ req, res }: { req: Request, res: Response }) => ({ req, res }), 
    }),
    AuthModule,
    RedisConfigModule,
    AppRoutingModule,
    GraphqlModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [MessagesGateway],
})
export class AppModule {}
