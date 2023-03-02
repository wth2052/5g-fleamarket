import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from 'src/global/entities/orders.entity';
import { UserEntity } from 'src/global/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity, UserEntity])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
