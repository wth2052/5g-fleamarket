import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AdminsEntity } from 'src/global/entities/admins.entity';
import { CategoriesEntity } from 'src/global/entities/categories.entity';
import { LikesEntity } from 'src/global/entities/likes.entity';
import { NoticesEntity } from 'src/global/entities/notices.entity';
import { OrdersEntity } from 'src/global/entities/orders.entity';
import { ProductImagesEntity } from 'src/global/entities/productimages.entity';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { UserEntity } from 'src/global/entities/users.entity';

@Injectable()
export class OrmConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    // console.log(this.configService.get('TEST'));
    console.log(__dirname);
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [
        AdminsEntity,
        CategoriesEntity,
        LikesEntity,
        NoticesEntity,
        OrdersEntity,
        ProductImagesEntity,
        ProductsEntity,
        UserEntity
      ],
      // entities: [__dirname + '/../**/*.entity.*'],
      synchronize: true, // 연결될때 데이터베이스 초기화됨
      migrations: [__dirname + '/../**/migrations/*.js'],
      migrationsTableName: 'migrations',
    };
  }
}
