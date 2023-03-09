import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  Render,
  Catch,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtDecodeDto } from './dto/jwtdecode-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from '../global/common/decorator/find-cookie.decorator';
import { json } from 'stream/consumers';
import { Public } from '../global/common/decorator/skip-auth.decorator';
@Catch(HttpException)
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
  ) {}
  // 내가 파는 상품 목록보기
  @UseGuards(JwtAuthGuard)
  @Get('mySellProduct')
  async findMySell(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const data = await this.ordersService.findMySell(userId);
    if (!data.length) {
      throw new NotFoundException('내가 판매하고 있는 상품이 없습니다.');
    }
    return { data: data };
  }
  // 제시된 가격목록 보기
  @UseGuards(JwtAuthGuard)
  @Get('products/:productId')
  async findMyProductsDealCheck(
    @Param('productId') productId: number,
    @Cookies('Authentication') jwt: JwtDecodeDto,
  ) {
    const userId = jwt.id;
    console.log('11111', userId);
    const data = await this.ordersService.findMyProductsDealCheck(
      userId,
      productId,
    );
    console.log('22222', data);
    return { data: data };
  }
  // 내가 가격제시한 상품 목록보기
  @Get('myPick')
  async findMyPick(@Cookies('Authentication') jwt: JwtDecodeDto) {
    console.log('@@@@@@@@@@@@@@@@@', jwt);
    const userId = jwt.id;
    const data = await this.ordersService.findMyPick(userId);
    return { data: data };
  }
  //(구매자 입장에서)성사된 거래 판매자 정보보기
  @Get('buyResult/:orderId')
  @Render('order-buyResult.ejs')
  async buyResult(
    @Param('orderId') orderId: number,
    @Cookies('Authentication') jwt: JwtDecodeDto,
  ) {
    const userId = jwt.id;
    const data = await this.ordersService.buyResult(userId, orderId);
    return { data: data };
  }
  //성사된 거래 구매자 정보보기
  @Get('sellResult/:orderId')
  @Render('order/order-sellResult.ejs')
  async sellResult(
    @Param('orderId') orderId: number,
    @Cookies('Authentication') jwt: JwtDecodeDto,
  ) {
    const userId = jwt.id;
    console.log('33144154', userId);
    const buyer = await this.ordersService.sellResult(userId, orderId);
    if (!buyer) {
      throw new NotFoundException(
        `${jwt.nickname}과 거래가 완료된 구매자가 없습니다`,
      );
    }
    return { data: buyer };
  }
  // 내가 구매한 목록
  @UseGuards(JwtAuthGuard)
  @Get('myBuyList')
  async getBuyList(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const buyList = await this.ordersService.getBuyList(userId);
    if (!buyList.length) {
      throw new NotFoundException(`${userId}는 구매한 상품이 없습니다.`);
    }
    return { data: buyList };
  }
  // 내가 판매가 완료된 목록
  @UseGuards(JwtAuthGuard)
  @Get('mySellList')
  async getSellList(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const data = await this.ordersService.getSellList(userId);
    return { data: data };
  }
  //판매자가 거래를 수락해서 거래종료
  @UseGuards(JwtAuthGuard)
  @Put('dealAccept/:orderId')
  dealAccept(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('orderId') orderId: number,
  ) {
    const userId = jwt.id;
    return this.ordersService.putdealAccept(userId, orderId);
  }
  // 상품 선택해서 가격 제시하고 주문 테이블에 저장
  @Post('priceDeal/:productId')
  postPriceDeal(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('productId') productId: number,
    @Body() data: CreateOrderDto,
  ) {
    const userId = jwt.id;
    return this.ordersService.postPriceDeal(userId, productId, data.price);
  }
  // 내가 제시한 가격 수정하기
  @Put('changeDeal/:orderId')
  changeDeal(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('orderId') orderId: number,
    @Body() data: CreateOrderDto,
  ) {
    const userId = jwt.id;
    return this.ordersService.changeDeal(userId, orderId, data.price);
  }

  // -------------------------
  // test용 productList
  @Public()
  @Render('test-product.ejs')
  @Get('product')
  async productList() {
    const product = await this.ordersService.pl();
    return { data: product };
  }
}
