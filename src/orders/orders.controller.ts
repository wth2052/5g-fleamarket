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
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
  ) {}
  // 내가 파는 상품 목록보기
  @UseGuards(JwtAuthGuard)
  @Get('mySellProduct')
  @Render('order-mySellProduct.ejs')
  async findMySell(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const data = await this.ordersService.findMySell(userId);
    return { data: data };
  }
  // 제시된 가격목록 보기
  @Get('products/:productId')
  findMyProductsDealCheck(
    @Param('productId') productId: number,
    @Cookies('Authentication') jwt: JwtDecodeDto,
  ) {
    const userId = jwt.id;
    return this.ordersService.findMyProductsDealCheck(userId, productId);
  }
  // 내가 가격제시한 상품 목록보기
  @Get('myPick')
  findMyPick(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    return this.ordersService.findMyPick(userId);
  }
  //(구매자 입장에서)성사된 거래 판매자 정보보기
  @Get('buyResult/:orderId')
  buyResult(
    @Param('orderId') orderId: number,
    @Cookies('Authentication') jwt: JwtDecodeDto,
  ) {
    const userId = jwt.id;
    return this.ordersService.buyResult(userId, orderId);
  }
  //성사된 거래 구매자 정보보기
  @Get('sellResult/:orderId')
  @Render('order-sellResult.ejs')
  async sellResult(
    @Param('orderId') orderId: number,
    @Cookies('Authentication') jwt: JwtDecodeDto,
  ) {
    const userId = jwt.id;
    const buyer = await this.ordersService.sellResult(userId, orderId);
    console.log(buyer);
    return { data: buyer };
  }
  // 내가 구매한 목록
  @Get('myBuyList')
  getBuyList(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    return this.ordersService.getBuyList(userId);
  }
  // 내가 판매가 완료된 목록
  @Get('mySellList')
  getSellList(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    return this.ordersService.getSellList(userId);
  }
  //판매자가 거래를 수락해서 거래종료
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
}
