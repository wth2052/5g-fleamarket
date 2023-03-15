import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './global/util/swagger/swagger-mainpage';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,

} from 'nest-winston'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 커스텀 로거 활성화시 주석 해제
    // logger: WinstonModule.createLogger({
    //   transports: [
    //     new winston.transports.Console({
    //       level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         nestWinstonModuleUtilities.format.nestLike('5gnunFleaMarket', {
    //           prettyPrint: true,
    //         }),
    //       ),
    //     }),
    //   ],
    // }),
  });

  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine('ejs');
  setupSwagger(app);

  app.enableCors({
    credentials: true,
  });
  await app.listen(3000);
}
void bootstrap();
