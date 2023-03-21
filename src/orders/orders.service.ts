import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
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
/////////////////////////////////////////
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

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
    private readonly config: ConfigService,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async sendSMS(buyerId, productTitle) {
    const buyer = await this.userRepository.findOne({
      where: { id: buyerId },
    });

    // 모듈들을 불러오기. 오류 코드는 맨 마지막에 삽입 예정
    const finErrCode = 404;
    const date = Date.now().toString();

    // 환경변수로 저장했던 중요한 정보들
    const serviceId = this.config.get('SENS_SERVICE_ID');
    const secretKey = this.config.get('SENS_SECRET_KEY');
    const accessKey = this.config.get('SENS_ACCESS_KEY');
    const my_number = this.config.get('PHONEMYNUM');

    // 그 외 url 관련
    const method = 'POST';
    const space = ' ';
    const newLine = '\n';
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
    const url2 = `/sms/v2/services/${serviceId}/messages`;

    // 중요한 key들을 한번 더 crypto-js 모듈을 이용하여 암호화 하는 과정.

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    axios({
      method: method,
      url: url,
      headers: {
        'Contenc-type': 'application/json; charset=utf-8',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': date,
        'x-ncp-apigw-signature-v2': signature,
      },
      data: {
        type: 'SMS',
        countryCode: '82',
        from: my_number,
        content: ` [냐옹상회]  거래성사 알림!!
  상품명 : ${productTitle.substring(0, 10)} ...
  거래가 성사되었습니다.`,
        messages: [
          // 구매자 전화번호
          { to: this.config.get('TESTPHONENUM') || buyer.phone },
        ],
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return finErrCode;
  }

  async findMyPick(id: number) {
    const pick = await this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.product', 'product')
      .leftJoinAndSelect('product.images', 'images')
      .where(`buyerId = :id`, { id })
      .andWhere('orders.status = :status', { status: 'sale' })
      .getMany(); //getRawMany 변경예정
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
      order: { updatedAt: 'DESC' },
      relations: ['category', 'images'],
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
    return { deal, product: checkUser };
  }
  async buyResult(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, deletedAt: null },
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
      select: ['id', 'email', 'nickname', 'phone'],
    });
    return sellerUser;
  }

  async sellResult(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, status: 'success', deletedAt: null },
    });
    if (!order) {
      throw new NotFoundException('선택하신 주문이 없습니다.');
    }
    const sellUser = await this.productRepository.find({
      where: { id: order.productId, sellerId: userId, status: 'success' },
      order: { updatedAt: 'DESC' },
    });
    if (!sellUser) {
      throw new ForbiddenException('내가 판매하는 물품이 아닙니다.');
    }
    const buyerInfo = await this.userRepository.findOne({
      where: { id: order.buyerId },
      select: ['id', 'email', 'nickname', 'phone'],
    });
    return buyerInfo;
  }

  async getBuyList(userId: number) {
    const buyList = await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.orders', 'orders')
      .leftJoinAndSelect('products.images', 'images')
      .where(`orders.buyerId = :userId`, { userId })
      .andWhere('orders.status = :status', { status: 'success' })
      .getMany();
    if (!buyList.length) {
      throw new NotFoundException('구매한 상품 내역이 없습니다.');
    }
    return buyList;
  }
  async getSellList(userId: number) {
    const myProduct = await this.productRepository.find({
      where: { sellerId: userId, status: 'success' },
      relations: ['category', 'images', 'orders'],
      order: { updatedAt: 'DESC' },
    });
    if (!myProduct.length) {
      throw new NotFoundException('판매하기 위해서 등록한 상품이 없습니다.');
    }
    return { myProduct };
  }
  async putdealAccept(userId: number, orderId: number) {
    const selectOrder = await this.orderRepository.findOne({
      where: { id: orderId, status: 'sale', deletedAt: null },
    });
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
      await this.sendSMS(selectOrder.buyerId, product.title);
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
      throw new BadRequestException('자신의 상품에는 deal을 할 수 없습니다.');
    }
    const user = await this.orderRepository.findOne({
      where: { productId: productId, buyerId: userId, deletedAt: null },
    });
    if (user) {
      throw new ForbiddenException(
        '이미 제시했습니다. 수정하기 버튼을 눌러주세요.',
      );
    }
    if (product.price > data) {
      throw new ConflictException();
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

  // 상품검색
  async productSearch(search: string, limit: number, offset: number) {
    try {
      if (!search) {
        throw new NotFoundException('검색어를 입력해주세요.');
      }
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      const products = await queryBuilder
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect(
          'product.seller',
          'seller',
          'seller.id = product.sellerId',
        )
        .leftJoinAndSelect('product.images', 'images')
        .take(limit)
        .skip(offset)
        .where({ title: Like(`%${search}%`) })
        .select([
          'product.id',
          'product.title',
          'product.price',
          'product.viewCount',
          'product.likes',
          'product.dealCount',
          'product.createdAt',
          'product.updatedAt',
          'category.id',
          'category.name',
          'seller.nickname',
          'images.imagePath',
        ])
        .getMany();

      const totalProducts = await queryBuilder
        .where({ title: Like(`%${search}%`) })
        .getCount();

      if (products.length === 0) {
        throw new NotFoundException(`검색한 상품이 없습니다.'${search}'`);
      }
      return { products, totalProducts };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //끌어올리기
  async pullUpProduct(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const now = new Date();

    // 마지막 끌올 시간 체크
    // 일수 * 시간 * 분 * 초 * 밀리초
    if (
      product.pullUp !== null &&
      now.getTime() - product.pullUp.getTime() < 2 * 24 * 60 * 60 * 1000
    ) {
      const nextPullUpTime =
        product.pullUp.getTime() + 2 * 24 * 60 * 60 * 1000 - now.getTime();
      const days = Math.floor(nextPullUpTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((nextPullUpTime / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((nextPullUpTime / (1000 * 60)) % 60);
      let message = '';
      if (days > 0) {
        message += `${days}일 `;
      }
      if (hours > 0) {
        message += `${hours}시간 `;
      }
      message += `${minutes}분 뒤에 끌어올릴 수 있어요`;
      throw new NotAcceptableException(message);
    }
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 끌올 현재시간 넣기
      await this.productRepository.update(productId, {
        pullUp: now,
      });

      // 상품 updateAt 업데이트
      await this.productRepository.update(productId, {
        updatedAt: now,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
