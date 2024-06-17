import { Module } from '@nestjs/common';
import { AppRoutingModule } from './app.routing-module';

@Module({
  imports: [
      AppRoutingModule,
  ],
})
export class AppModule {}
