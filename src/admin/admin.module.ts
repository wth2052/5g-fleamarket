import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsEntity } from 'src/global/entities/admins.entity';
import { CategoriesEntity } from 'src/global/entities/categories.entity';
import { NoticesEntity } from 'src/global/entities/notices.entity';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { UserEntity } from '../global/entities/users.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { LocalStrategy } from '../auth/strategy/local.strategy';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { JwtRefreshStrategy } from '../auth/strategy/jwt-refresh.strategy';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProductsEntity,
      CategoriesEntity,
      AdminsEntity,
      NoticesEntity,
      AuthModule,
    ]),
  ],
  controllers: [AdminController],
  providers: [
    UserService,
    AdminService,
    AuthService,
    JwtService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AdminModule {}
