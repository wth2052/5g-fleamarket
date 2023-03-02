import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from 'src/global/entities/orders.entity';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { UserEntity } from 'src/global/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private orderRepository: Repository<OrdersEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async findMyPick(id: number) {
    return await this.orderRepository.find({
      where: { buyerId: id },
      relations: ['buyer'],
    });
  }

  async findMySell(id: number) {
    return await this.productRepository.find({
      where: { sellerId: id },
    });
  }
  async findMyDeal(id: number) {
    return await this.orderRepository.find({
      where: { productId: id },
    });
  }

  async buyerDone(buyerId: number, orderId: number) {
    const a = await this.orderRepository.findOne({
      where: { buyerId, id: orderId },
    });
    if (!a) {
      throw new NotFoundException('해당되는 주문이 없습니다.');
    }
    if (a.status === 'sale') {
      throw new UnauthorizedException('아직 진행되지 않았습니다.');
    }
    if (a.status === 'fail') {
      throw new UnauthorizedException('판매자가 다른 제안을 수락했습니다.');
    }
    const sellerInfo = await this.productRepository.findOne({
      where: { id: a.productId },
    });
    const sellerUser = await this.userRepository.findOne({
      where: { id: sellerInfo.id },
    });
    return sellerUser;
  }

  async sellerDone(productId: number, buyerId: number) {
    const b = await this.orderRepository.findOne({
      where: { productId, buyerId },
    });
    if (!b) {
      throw new NotFoundException('해당되는 상품이 없습니다.');
    }
    const buyerUser = await this.userRepository.findOne({
      where: { id: buyerId },
    });
    return buyerUser;
  }
}
