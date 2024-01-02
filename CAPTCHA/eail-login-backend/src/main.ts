import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //允许跨域
  app.useGlobalPipes(new ValidationPipe()); //全局验证管道
  await app.listen(3001);
}
bootstrap();
