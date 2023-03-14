import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { number } from 'joi';
import { OrdersEntity } from 'src/global/entities/orders.entity';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { UserEntity } from 'src/global/entities/users.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
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
      where: { buyerId: id, status: 'sale' },
      relations: ['product'],
    });
    if (!pick.length) {
      throw new NotFoundException(
        `딜한 주문이 없거나 진행중인 상품이 없습니다.`,
      );
    }
    return pick;
  }

  async findMySell(userId: number) {
    const products = await this.productRepository.find({
      where: { sellerId: userId, status: 'sale' },
    });
    return products;
  }

  async findMyProductsDealCheck(userId: number, productId: number) {
    const checkUser = await this.productRepository.findOne({
      where: {
        id: productId,
        sellerId: userId,
        status: 'sale',
      },
    });
    if (!checkUser) {
      throw new ForbiddenException('당신의 물건이 아닙니다.');
    }
    const deal = await this.orderRepository.find({
      where: { productId, status: 'sale' },
    });
    if (!deal.length) {
      throw new NotFoundException(
        '상품에 제시된 딜이 없거나 이미 판매됬습니다.',
      );
    }
    return deal;
  }
  async buyResult(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, deleteAt: null },
    });
    if (!order) {
      throw new NotFoundException('해당되는 주문이 없습니다.');
    }
    if (order.buyerId !== Number(userId)) {
      throw new ForbiddenException('내가 구매한 상품이 아닙니다.');
    }
    if (order.status === 'sale') {
      throw new ForbiddenException('아직 선택되지 않았습니다.');
    }
    if (order.status === 'sold') {
      throw new ForbiddenException('판매자가 다른 제안을 수락했습니다.');
    }
    const sellerInfo = await this.productRepository.findOne({
      where: { id: order.productId },
    });
    const sellerUser = await this.userRepository.findOne({
      where: { id: sellerInfo.id },
      select: ['id', 'email', 'nickname'],
    });
    return sellerUser;
  }

  async sellResult(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, status: 'success', deleteAt: null },
    });
    if (!order) {
      throw new NotFoundException('선택하신 주문이 없습니다.');
    }
    const sellUser = await this.productRepository.find({
      where: { id: order.productId, sellerId: userId, status: 'success' },
    });
    if (!sellUser) {
      throw new ForbiddenException('내가 판매하는 물품이 아닙니다.');
    }
    const buyerInfo = await this.userRepository.findOne({
      where: { id: order.buyerId },
      select: ['id', 'email', 'nickname'],
    });
    return buyerInfo;
  }

  async getBuyList(userId: number) {
    const buyList = await this.orderRepository.find({
      where: { buyerId: userId, status: 'success', deleteAt: null },
      relations: ['product'],
    });
    return buyList;
  }
  async getSellList(userId: number) {
    const myProduct = await this.productRepository.find({
      where: { sellerId: userId, status: 'success' },
      select: ['id'],
    });
    if (!myProduct.length) {
      throw new NotFoundException('판매하기 위해서 등록한 상품이 없습니다.');
    }
    for (let i = 0; i < myProduct.length; i++) {
      const real = await this.orderRepository.find({
        where: { productId: myProduct[i].id, status: 'success' },
        relations: ['product'],
      });
      console.log('판매 성공', real);
      if (!real.length) {
        throw new NotFoundException('판매를 성공한 상품이 없습니다.');
      }
      return real;
    }
  }
  async putdealAccept(userId: number, orderId: number) {
    const selectOrder = await this.orderRepository.findOne({
      where: { id: orderId, status: 'sale', deleteAt: null },
    });
    console.log('selectOrder', selectOrder);
    if (!selectOrder) {
      throw new NotFoundException(`${orderId}는 구매할 수 없는 주문입니다.`);
    }
    const product = await this.productRepository.findOne({
      where: { id: selectOrder.productId, sellerId: userId },
    });
    if (!product) {
      throw new ForbiddenException('내가 판매하는 상품이 아닙니다.');
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
      await this.productRepository.update(
        { id: selectOrder.productId },
        { status: 'success' },
      );
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      console.log(e);
    } finally {
      await queryRunner.release();
    }
  }
  async postPriceDeal(userId: number, productId: number, data: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('상품 정보가 없습니다.');
    }
    if (product.sellerId === Number(userId)) {
      throw new ForbiddenException('자신의 상품에는 deal을 할 수 없습니다.');
    }
    const user = await this.orderRepository.findOne({
      where: { productId: productId, buyerId: userId, deleteAt: null },
    });
    if (user) {
      throw new ForbiddenException(
        '이미 제시했습니다. 수정하기 버튼을 눌러주세요.',
      );
    }
    await this.orderRepository.insert({
      productId: productId,
      buyerId: userId,
      deal: data,
    });
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const count = product.dealCount;
    try {
      await this.productRepository.update(
        { id: productId },
        { dealCount: count + 1 },
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
    } finally {
      await queryRunner.release();
    }
  }
  async changeDeal(userId: number, orderId: number, data: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['product'],
    });
    console.log('1234', order);
    if (!order) {
      throw new NotFoundException('해당 요청을 찾을수 없습니당');
    }
    if (order.buyerId !== Number(userId)) {
      throw new ForbiddenException('해당 상품이 없습니다.');
    }
    if (data > 1000000000) {
      throw new ForbiddenException('너무 큰 가격입니다. 다시 확인해주세요');
    }
    console.log('@@@@@@@@@@@@@@', order.product.price);
    if (order.product.price > data) {
      throw new ForbiddenException('판매자가 제시한 가격보다 낮습니다.');
    }
    await this.orderRepository.update({ id: orderId }, { deal: data });
  }
  async cancelDeal(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, buyerId: userId, status: 'sale' },
    });
    if (!order) {
      throw new NotFoundException('해당되는 주문이 없습니다.');
    }
    await this.orderRepository.softDelete({ id: orderId });
  }

  // -----------------------------
  // test
  async pl() {
    return await this.productRepository.find({
      relations: ['seller'],
    });
  }

  // 상품검색
  async productSearch(search: string) {
    try {
      if (!search) {
        throw new NotFoundException('검색어를 입력해주세요.');
      }
      const products = await this.productRepository.find({
        where: { title: Like(`%${search}%`) },
      });
      if (products.length === 0) {
        throw new NotFoundException(`검색한 상품이 없습니다.'${search}'`);
      }
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
