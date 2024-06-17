import { Module } from '@nestjs/common';
import { HelloResolver } from './resolvers/hello.resolver';

@Module({
  providers: [HelloResolver],
})
export class HelloModule {}
