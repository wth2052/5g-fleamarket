import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmConfig } from './config/orm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TypeOrmModule.forRootAsync({
      useClass: OrmConfig,
      inject: [ConfigService],
    }),
  ],

  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
