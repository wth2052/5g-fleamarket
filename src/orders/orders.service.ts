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

  async buyerDone(userId: number, orderId: number) {
    const a = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!a) {
      throw new NotFoundException('해당되는 주문이 없습니다.');
    }
    if (a.buyerId !== Number(userId)) {
      throw new UnauthorizedException('내가 구매한 상품이 아닙니다.');
    }
    if (a.status === 'sale') {
      throw new UnauthorizedException('아직 선택되지 않았습니다.');
    }
    if (a.status === 'sold') {
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

  async sellDone(userId: number, orderId: number) {
    const a = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!a) {
      throw new NotFoundException('해당되는 주문이 없습니다.');
    }
    if (a.status === 'sale') {
      throw new UnauthorizedException('아직 선택되지 않았습니다.');
    }
    if (a.status === 'sold') {
      throw new UnauthorizedException('판매자가 다른 제안을 수락했습니다.');
    }
    const buyerInfo = await this.userRepository.findOne({
      where: { id: userId },
    });
    return buyerInfo;
  }

  async getBuyList(userId: number) {
    return this.orderRepository.find({
      where: { buyerId: userId, status: 'success' },
    });
  }
  async getSellList(userId: number) {
    const myProduct = await this.productRepository.find({
      where: { sellerId: userId },
      select: ['id'],
    });
    for (let i = 0; i < myProduct.length; i++) {
      console.log(myProduct.length);
      const real = await this.orderRepository.find({
        where: { productId: myProduct[i].id, status: 'success' },
      });
      console.log(myProduct[i].id);
      console.log(real);
      return real;
    }
  }
}
