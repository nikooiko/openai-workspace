import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestJSLoggerService } from './logger/services/nestjs-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(NestJSLoggerService));
  const version = 1;
  const port = 3000;
  const apiPath = `api/v${version}`;
  app.setGlobalPrefix(apiPath);
  const config = new DocumentBuilder()
    .setTitle('OpenAI - Job Board API')
    .setVersion(`${version}.0`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiPath, app, document);
  await app.listen(port);
}

bootstrap();
