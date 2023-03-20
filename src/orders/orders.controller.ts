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
  NotAcceptableException,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtDecodeDto } from '../user/dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from '../global/common/decorator/find-cookie.decorator';
import { json } from 'stream/consumers';
import { Public } from '../global/common/decorator/skip-auth.decorator';
import { number } from 'joi';
import { ApiQuery } from '@nestjs/swagger';
@Catch(HttpException)
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
  ) {}
  /////////////////////////////////////////

  /////////////////////////////

  // 내가 파는 상품 목록보기
  @Get('me/sell/product')
  async findMySell(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const data = await this.ordersService.findMySell(userId);
    if (!data.length) {
      throw new NotFoundException('내가 판매하고 있는 상품이 없습니다.');
    }
    return { data: data };
  }
  // 제시된 가격목록 보기
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

  @Get('me/pick')
  async findMyPick(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const data = await this.ordersService.findMyPick(userId);
    return { data: data };
  }
  //(구매자 입장에서)성사된 거래 판매자 정보보기
  @Get('buy/result/:orderId')
  async buyResult(
    @Param('orderId') orderId: number,
    @Cookies('Authentication') jwt: JwtDecodeDto,
  ) {
    const userId = jwt.id;
    const data = await this.ordersService.buyResult(userId, orderId);
    return { data: data };
  }
  //성사된 거래 구매자 정보보기
  @Get('sell/result/:orderId')
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
  @Get('me/buy/list')
  async getBuyList(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const buyList = await this.ordersService.getBuyList(userId);
    return { data: buyList };
  }
  // 내가 판매가 완료된 목록
  @Get('me/sell/list')
  async getSellList(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const data = await this.ordersService.getSellList(userId);
    console.log('!@#$%', data);
    return { data: data };
  }
  //판매자가 거래를 수락해서 거래종료
  @Put('deal/accept/:orderId')
  dealAccept(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('orderId') orderId: number,
  ) {
    const userId = jwt.id;
    return this.ordersService.putdealAccept(userId, orderId);
  }
  // 상품 선택해서 가격 제시하고 주문 테이블에 저장
  @Post('deal/price/:productId')
  postPriceDeal(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('productId') productId: number,
    @Body() data: CreateOrderDto,
  ) {
    const userId = jwt.id;
    console.log(userId);
    return this.ordersService.postPriceDeal(userId, productId, data.price);
  }
  // 내가 제시한 가격 수정하기
  @Put('deal/change/:orderId')
  changeDeal(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('orderId') orderId: number,
    @Body() data: CreateOrderDto,
  ) {
    const userId = jwt.id;
    return this.ordersService.changeDeal(userId, orderId, data.price);
  }
  // 제시한 Deal 삭제하기
  @Delete('deal/cancel/:orderId')
  cancelDeal(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('orderId') orderId: number,
  ) {
    const userId = jwt.id;
    return this.ordersService.cancelDeal(userId, orderId);
  }
  // -------------------------
  // test용 productList
  // @Public()
  // @Get('product/detail/graph/:productId')
  // async productList(@Param('productId') productId: number) {
  //   const product = await this.ordersService.graph(productId);
  //   return product;
  // }

  // 상품검색
  @Public()
  @Get('productSearch')
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
  // http://localhost:3000/orders/productSearch?search=피카츄
  async productSearch(
    @Query('search') search: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    const product = await this.ordersService.productSearch(
      search,
      limit,
      offset,
    );
    return { data: product.products, totalProducts: product.totalProducts };
  }

  // 끌어올리기
  @Post('pullUp/:productId')
  pullUpProduct(@Param('productId') productId: number) {
    return this.ordersService.pullUpProduct(productId);
  }
}
