import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './global/util/swagger/swagger-mainpage';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { HttpExceptionFilter } from './global/filter/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine('ejs');

  // 특정 디렉터리를 제외하도록 기본 URL 수정
  app.setGlobalPrefix('');

  setupSwagger(app);

  app.enableCors({
    credentials: true,
  });
  await app.listen(3000);
}
void bootstrap();
