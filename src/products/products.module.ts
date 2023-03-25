import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from 'src/global/entities/categories.entity';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { UserEntity } from 'src/global/entities/users.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductImagesService } from './product-images.service';
import { ProductImagesEntity } from 'src/global/entities/productimages.entity';
import { LikesEntity } from '../global/entities/likes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoriesEntity,
      UserEntity,
      ProductsEntity,
      ProductImagesEntity,
      LikesEntity,

    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtService, ProductImagesService],
})
export class ProductsModule {}
