import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot({ isGlobal: true }),
    //registerAsync? ConfigService를 주입해두면, .env를 읽어올 때까지 secret을 등록하는 작업을 유예시킴.
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
