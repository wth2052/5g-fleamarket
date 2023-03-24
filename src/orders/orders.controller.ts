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
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@Catch(HttpException)
@Controller('api/orders')
@ApiTags('주문 API')
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
  @ApiOperation({
    summary: '판매중인 상품 목록보기',
    description: '유저가 판매중인 상품 목록을 요청합니다.',
  })
  @ApiOkResponse({ description: '판매중인 상품 목록' })
  @ApiNotFoundResponse({ description: '내가 판매하고 있는 상품이 없습니다.' })
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
  @ApiOperation({
    summary: '제시된 가격목록 보기',
    description: '해당 상품에 제시된 가격목록을 요청합니다.',
  })
  @ApiOkResponse({ description: '가격제시 확인' })
  @ApiNotFoundResponse({
    description: '상품에 제시된 딜이 없거나 이미 판매됬습니다.',
  })
  @ApiForbiddenResponse({ description: '당신의 물건이 아닙니다.' })
  @ApiParam({ type: 'number', name: 'productId', description: '상품 ID' })
  async findMyProductsDealCheck(
    @Param('productId')
    productId: number,
    @Cookies('Authentication') jwt: JwtDecodeDto,
  ) {
    const userId = jwt.id;
    const data = await this.ordersService.findMyProductsDealCheck(
      userId,
      productId,
    );
    return { data: data };
  }

  // 내가 가격제시한 상품 목록보기
  @Get('me/pick')
  @ApiOperation({
    summary: '가격제시한 상품 목록보기',
    description: '유저가 가격제시한 상품 목록을 요청 합니다.',
  })
  @ApiOkResponse({ description: '가격제시한 상품 목록' })
  @ApiNotFoundResponse({
    description: '딜한 주문이 없거나 진행중인 상품이 없습니다.',
  })
  async findMyPick(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const data = await this.ordersService.findMyPick(userId);
    return { data: data };
  }

  //(구매자 입장에서)성사된 거래 판매자 정보보기
  @Get('buy/result/:orderId')
  @ApiOperation({
    summary: '성사된 거래 판매자 정보보기',
    description: '해당 주문에 대한 판매자 정보를 요청합니다.',
  })
  @ApiOkResponse({ description: '성사된 거래 판매자 정보' })
  @ApiNotFoundResponse({ description: '해당되는 주문이 없습니다.' })
  @ApiForbiddenResponse({
    description: '선택되지 않았거나 다른 제안이 수락되었습니다.',
  })
  @ApiBadRequestResponse({ description: '내가 구매한 상품이 아닙니다.' })
  @ApiParam({ type: 'number', name: 'orderId', description: '주문 ID' })
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
  @ApiOperation({
    summary: '성사된 거래 구매자 정보보기',
    description: '해당 주문에 대한 구매자 정보를 요청합니다.',
  })
  @ApiOkResponse({ description: '성사된 거래 구매자 정보' })
  @ApiNotFoundResponse({ description: '선택하신 주문이 없습니다.' })
  @ApiForbiddenResponse({ description: '내가 판매하는 물품이 아닙니다.' })
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
  @ApiOperation({
    summary: '내가 구매한 목록',
    description: '유저의 가격제시가 성공한 상품 목록을 요청합니다.',
  })
  @ApiOkResponse({ description: '구매완료 된 상품 목록' })
  @ApiNotFoundResponse({ description: '구매한 상품 내역이 없습니다.' })
  async getBuyList(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const buyList = await this.ordersService.getBuyList(userId);
    return { data: buyList };
  }
  // 내가 판매가 완료된 목록
  @Get('me/sell/list')
  @ApiOperation({
    summary: '내가 판매한 목록',
    description: '유저가 가격제시를 수락한 상품 목록을 요청합니다.',
  })
  @ApiOkResponse({ description: '판매완료 된 상품 목록' })
  @ApiNotFoundResponse({ description: '판매한 상품 내역이 없습니다.' })
  async getSellList(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const data = await this.ordersService.getSellList(userId);
    return { data: data };
  }
  //판매자가 거래를 수락해서 거래종료
  @Put('deal/accept/:orderId')
  @ApiOperation({
    summary: '거래 수락하기',
    description: '해당 상품에 대한 가격제시를 수락하여 거래를 종료합니다.',
  })
  @ApiOkResponse({ description: '거래가 성사되었습니다.' })
  @ApiNotFoundResponse({ description: '해당 주문이 없습니다.' })
  @ApiForbiddenResponse({ description: '판매하는 상품이 아닙니다.' })
  dealAccept(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('orderId') orderId: number,
  ) {
    const userId = jwt.id;
    return this.ordersService.putdealAccept(userId, orderId);
  }
  // 상품 선택해서 가격 제시하고 주문 테이블에 저장
  @Post('deal/price/:productId')
  @ApiOperation({
    summary: '가격제시하기',
    description: '유저가 상품을 선택하여 가격을 제시 합니다.',
  })
  @ApiOkResponse({ description: '가격제시가 성공적으로 완료되었습니다.' })
  @ApiNotFoundResponse({ description: '상품 정보가 없습니다.' })
  @ApiForbiddenResponse({ description: '이미 가격제시를 하셨습니다.' })
  @ApiBadRequestResponse({
    description: '자신의 상품에는 deal을 할 수 없습니다.',
  })
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
  @ApiOperation({
    summary: '가격제시 수정하기',
    description: '유저가 해당 상품에 대한 가격제시를 수정합니다.',
  })
  @ApiOkResponse({ description: '가격제시가 수정되었습니다.' })
  @ApiNotFoundResponse({ description: '해당 주문이 없습니다.' })
  @ApiForbiddenResponse({ description: '판매자가 제시한 가격보다 낮습니다.' })
  @ApiBadRequestResponse({
    description: '너무 큰 가격입니다. 다시 확인해주세요.',
  })
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
  @ApiOperation({
    summary: '가격제시 취소하기',
    description: '가격제시를 취소합니다.',
  })
  @ApiOkResponse({ description: '가격제시가 취소되었습니다.' })
  @ApiNotFoundResponse({ description: '해당 주문이 없습니다.' })
  cancelDeal(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('orderId') orderId: number,
  ) {
    const userId = jwt.id;
    return this.ordersService.cancelDeal(userId, orderId);
  }

  // 상품검색
  @Public()
  @Get('productSearch')
  @ApiOperation({
    summary: '상품검색',
    description: '유저가 상품을 검색합니다.',
  })
  @ApiOkResponse({ description: '상품검색 결과' })
  @ApiForbiddenResponse({ description: '검색어를 입력해주세요.' })
  @ApiNotFoundResponse({ description: '검색결과가 없습니다.' })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
  // https://5gnunfleamarket.shop/orders/productSearch?search=피카츄
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
  @ApiOperation({
    summary: '끌어올리기',
    description: '유저가 등록한 상품을 최신화 해줍니다.',
  })
  @ApiOkResponse({ description: '끌어올리기가 완료되었습니다.' })
  @ApiNotFoundResponse({ description: '해당 상품이 없습니다.' })
  pullUpProduct(@Param('productId') productId: number) {
    return this.ordersService.pullUpProduct(productId);
  }
}
