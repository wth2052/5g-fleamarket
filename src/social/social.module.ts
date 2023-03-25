import { SocialController } from './social.controller';
import { AppService } from '../app.service';
import { JwtGoogleStrategy } from '../auth/strategy/jwt-google.strategy';
import { CACHE_MANAGER, Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { ProductsEntity } from '../global/entities/products.entity';
import { ProductImagesEntity } from '../global/entities/productimages.entity';
import { OrdersEntity } from '../global/entities/orders.entity';
import { cacheModule } from "../user/user.module";

@Module({
  imports: [cacheModule,
    TypeOrmModule.forFeature([
      UserEntity,
      ProductsEntity,
      ProductImagesEntity,
      OrdersEntity,
    ]),
  ],
  controllers: [SocialController],
  providers: [
    SocialService,
    JwtService,
    JwtGoogleStrategy,
    UserService,
    AuthService,

  ],
})
export class SocialModule {}
