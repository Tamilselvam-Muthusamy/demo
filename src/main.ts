import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
