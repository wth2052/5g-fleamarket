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
  Render,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Cookies } from '../global/common/decorator/find-cookie.decorator';
import { JwtService } from '@nestjs/jwt';
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
  ) {}
  // 내가 파는 상품 목록보기
  @Get('mySellProduct/:sellerId')
  findMySell(
    @Param('sellerId') id: number,
    @Cookies('Authentication') jwt: string,
  ) {
    console.log('헤더', this.jwtService.decode(jwt));

    return this.ordersService.findMySell(id);
  }
  // 제시된 가격목록 보기
  @Get('products/:productId')
  findMyProductsDealCheck(@Param('productId') id: number) {
    return this.ordersService.findMyProductsDealCheck(id);
  }
  // 내가 가격제시한 상품 목록보기
  @Get('myPick/:buyerId')
  findMyPick(@Param('buyerId') id: number) {
    return this.ordersService.findMyPick(id);
  }
  //(구매자 입장에서)성사된 거래 판매자 정보보기
  @Get('buyResult/:userId/:orderId')
  buyResult(
    @Param('userId') userId: number,
    @Param('orderId') orderId: number,
  ) {
    return this.ordersService.buyResult(userId, orderId);
  }
  //성사된 거래 구매자 정보보기
  @Get('sellResult/:userId/:orderId')
  sellResult(
    @Param('userId') userId: number,
    @Param('orderId') orderId: number,
  ) {
    return this.ordersService.sellResult(userId, orderId);
  }
  // 내가 구매한 목록

  @Get('myBuyList/:userId')
  getBuyList(@Param('userId') userId: number) {
    return this.ordersService.getBuyList(userId);
  }
  // 내가 판매가 완료된 목록
  @Get('mySellList/:userId')
  getSellList(@Param('userId') userId: number) {
    return this.ordersService.getSellList(userId);
  }
  //판매자가 거래를 수락해서 거래종료
  @Put('dealAccept/:userId/:orderId')
  dealAccept(
    @Param('userId') userId: number,
    @Param('orderId') orderId: number,
  ) {
    return this.ordersService.purtdealAccept(userId, orderId);
  }
  // 상품 선택해서 가격 제시하고 주문 테이블에 저장
  @Post('priceDeal/:userId/:productId')
  postPriceDeal(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
    @Body() data: CreateOrderDto,
  ) {
    return this.ordersService.postPriceDeal(userId, productId, data.price);
  }
  // 내가 제시한 가격 수정하기
  @Put('ChangeDeal/:userId/:orderId')
  changeDeal(
    @Param('userId') userId: number,
    @Param('orderId') orderId: number,
    @Body() data: CreateOrderDto,
  ) {
    return this.ordersService.changeDeal(userId, orderId, data.price);
  }
}
