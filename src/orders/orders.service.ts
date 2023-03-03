import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from 'src/global/entities/orders.entity';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { UserEntity } from 'src/global/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async findMyPick(id: number) {
    const pick = await this.orderRepository.find({
      where: { buyerId: id },
    });
    if (!pick.length) {
      throw new NotFoundException(`${id}는 물건을 선택한적이 없습니다.`);
    }
    return pick;
  }

  async findMySell(id: number) {
    return await this.productRepository.find({
      where: { sellerId: id },
    });
  }

  async findMyProductsDealCheck(id: number) {
    return await this.orderRepository.find({
      where: { productId: id },
    });
  }

  async buyResult(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('해당되는 주문이 없습니다.');
    }
    if (order.buyerId !== Number(userId)) {
      throw new UnauthorizedException('내가 구매한 상품이 아닙니다.');
    }
    if (order.status === 'sale') {
      throw new UnauthorizedException('아직 선택되지 않았습니다.');
    }
    if (order.status === 'sold') {
      throw new UnauthorizedException('판매자가 다른 제안을 수락했습니다.');
    }
    const sellerInfo = await this.productRepository.findOne({
      where: { id: order.productId },
    });
    const sellerUser = await this.userRepository.findOne({
      where: { id: sellerInfo.id },
    });
    return sellerUser;
  }

  async sellResult(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('선택하신 주문이 없습니다.');
    }
    if (order.status === 'sale') {
      throw new UnauthorizedException('아직 선택하지 않았습니다.');
    }
    if (order.status === 'sold') {
      throw new UnauthorizedException('다른 제안을 수락했습니다.');
    }
    const buyerInfo = await this.userRepository.findOne({
      where: { id: userId },
    });
    return buyerInfo;
  }

  async getBuyList(userId: number) {
    const buyList = await this.orderRepository.find({
      where: { buyerId: userId, status: 'success' },
    });
    if (!buyList.length) {
      throw new NotFoundException(`${userId}는 구매한 상품이 없습니다.`);
    }
    return buyList;
  }
  async getSellList(userId: number) {
    const myProduct = await this.productRepository.find({
      where: { sellerId: userId },
      select: ['id'],
    });
    if (!myProduct.length) {
      throw new NotFoundException('판매하귀 위해서 등록한 상품이 없습니다.');
    }
    for (let i = 0; i < myProduct.length; i++) {
      const real = await this.orderRepository.find({
        where: { productId: myProduct[i].id, status: 'success' },
      });
      console.log('판매 성공', real);
      if (!real.length) {
        throw new NotFoundException('판매를 성공한 상품이 없습니다.');
      }
      return real;
    }
  }
  async purtdealAccept(userId: number, orderId: number) {
    const selectOrder = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!selectOrder) {
      throw new NotFoundException(`${orderId}는 없는 주문 아이디 입니다.`);
    }
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.orderRepository.update({ id: orderId }, { status: 'success' });
      await this.orderRepository.update(
        { productId: selectOrder.productId, status: 'sale' },
        { status: 'sold' },
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
    } finally {
      await queryRunner.release();
    }
  }
  async postPriceDeal(userId: number, productId: number, data: number) {
    await this.orderRepository.insert({
      productId: productId,
      buyerId: userId,
      deal: data,
    });
  }
}
