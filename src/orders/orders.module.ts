import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from 'src/global/entities/orders.entity';
import { UserEntity } from 'src/global/entities/users.entity';
import { ProductsEntity } from '../global/entities/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersEntity, UserEntity, ProductsEntity]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
