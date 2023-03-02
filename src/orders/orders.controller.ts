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
  @Get(':sellerId')
  findMySell(@Param('sellerId') id: number) {
    return this.ordersService.findMySell(id);
  }
  // 제시된 가격목록 보기
  @Get(':productId')
  findMyDeal(@Param('productId') id: number) {
    return this.ordersService.findMyDeal(id);
  }
  // 판매자 결과
  @Get('orders/:orderId')
  sellerDone(
    @Body('productId') productId: number,
    @Body('buyerId') buyerId: number,
  ) {
    return this.ordersService.sellerDone(productId, buyerId);
  }
  // 찜한 상품 목록보기
  @Get(':buyerId')
  findMyPick(@Param('id') id: number) {
    return this.ordersService.findMyPick(id);
  }
  // 구매자 결과
  @Get('orders/:buyerId/:orderId')
  buyerDone(
    @Param('buyerId') buyerId: number,
    @Param('orderId') orderId: number,
  ) {
    return this.ordersService.buyerDone(buyerId, orderId);
  }
}
