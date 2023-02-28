import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmConfig } from './global/config/orm.config';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRootAsync({
      useClass: OrmConfig,
    }),
  ],

  controllers: [AppController, UserController, AuthController],
  providers: [AppService],
})
export class AppModule {}
