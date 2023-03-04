import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminStrategy } from 'src/admin-auth/passport/passport-strategy.access';
import { AdminsEntity } from 'src/global/entities/admins.entity';
import { CategoriesEntity } from 'src/global/entities/categories.entity';
import { NoticesEntity } from 'src/global/entities/notices.entity';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { UserEntity } from "../global/entities/users.entity";
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProductsEntity, CategoriesEntity, AdminsEntity, NoticesEntity])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
