import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 판매상품 목록보기
  @Get('seller/:sellerId')
  findMySell(@Param('sellerId') id: number) {
    return this.ordersService.findMySell(id);
  }
  // 제시된 가격목록 보기
  @Get(':productId')
  findMyDeal(@Param('productId') id: number) {
    return this.ordersService.findMyDeal(id);
  }
  // 내가 가격제시한 상품 목록보기
  @Get('buyerId/:buyerId')
  findMyPick(@Param('buyerId') id: number) {
    return this.ordersService.findMyPick(id);
  }
  //결과
  @Get('result/:userId/:orderId')
  buyerDone(
    @Param('userId') userId: number,
    @Param('orderId') orderId: number,
  ) {
    return this.ordersService.buyerDone(userId, orderId);
  }
  @Get('buyList/:userId')
  getBuyList(@Param('userId') userId: number) {
    return this.ordersService.getBuyList(userId);
  }
  @Get('sellList/:userId')
  getSellList(@Param('userId') userId: number) {
    return this.ordersService.getSellList(userId);
  }
  // // 판매자 결과
  // @Get('seller/:orderId')
  // sellerDone(@Param('orderId') orderId: number) {
  //   return this.ordersService.sellerDone(orderId);
  // }
}
