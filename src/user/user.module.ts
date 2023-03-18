import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
// import { SmsService } from '../sms/sms.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ProductsEntity } from '../global/entities/products.entity';
import { ProductImagesEntity } from '../global/entities/productimages.entity';
import { OrdersEntity } from '../global/entities/orders.entity';

export const cacheModule = CacheModule.registerAsync({
  useFactory: async () => ({
    store: redisStore,
    host: '127.0.0.1',
    port: '6379',
  }),
});
@Module({
  imports: [
    cacheModule,
    TypeOrmModule.forFeature([
      UserEntity,
      ProductsEntity,
      ProductImagesEntity,
      OrdersEntity,
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({
      defaultStrategy: 'jwt-access-token',
      session: false,
    }),

    //registerAsync? ConfigService를 주입해두면, .env를 읽어올 때까지 secret을 등록하는 작업을 유예시킴.
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRETKEY'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  //SmsService,
  providers: [UserService, AuthService],
  controllers: [UserController],
  exports: [cacheModule],
})
export class UserModule {}
