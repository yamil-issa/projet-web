import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import { UnauthorizedExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  dotenv.config();
  
  console.log('Starting application...');
  console.log('REDIS_HOST:', process.env.REDIS_HOST);

  const app = await NestFactory.create(AppModule);
  app.use(passport.initialize());
  app.useGlobalFilters(new UnauthorizedExceptionFilter()); // Apply the exception filter globally
   // Configure CORS to allow all origins
   app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
