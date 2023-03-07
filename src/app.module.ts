import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmConfig } from './config/orm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { SmsService } from './sms/sms.service';
import { SmsModule } from './sms/sms.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './global/entities/users.entity';
import * as Joi from 'joi';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { OrdersModule } from './orders/orders.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from 'src/helath-check/health-check.controller';
import { HttpModule } from '@nestjs/axios';
import { LoggingModule } from './global/util/logger/logger.module';
import {ViewController} from "./views/view.controller";
import { ProductsModule } from './products/products.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_ACCESS_SECRETKEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_SECRETKEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      useClass: OrmConfig,
      inject: [ConfigService],
    }),
    SmsModule,
    AdminModule,
    OrdersModule,
    LoggingModule,
    TerminusModule,
    ProductsModule,
  ],
  controllers: [AppController, HealthCheckController,ViewController],
  providers: [
    AppService,
    SmsService,
    AuthService,
    UserService,
    JwtService,
    HttpModule,
    HealthCheckController,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
