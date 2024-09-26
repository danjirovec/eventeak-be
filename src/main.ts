import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
    credentials: true,
  });
  app.use(cookieParser());
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
