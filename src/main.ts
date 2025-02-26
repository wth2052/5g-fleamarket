import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './global/util/swagger/swagger-mainpage';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

    const config = new DocumentBuilder()
    .setTitle('5g Swagger')
    .setDescription('5조의 스웨거입니다.')
    .setVersion('1.0.0')
    .addTag('swagger')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
