import { Module } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GraphqlModule } from './graphql/graphql.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RedisConfigModule } from './infrastructure/configuration/redis.config.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { AppRoutingModule } from './app.routing-module';
import { JwtModule } from '@nestjs/jwt';

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
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class AppModule {}
