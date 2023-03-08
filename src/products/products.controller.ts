import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { Public } from 'src/global/common/decorator/skip-auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
import { Cookies } from 'src/global/common/decorator/find-cookie.decorator';
import { JwtDecodeDto } from 'src/orders/dto/jwtdecode-order.dto';

@Controller('productss')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  //상품목록조회
  // @UseGuards(JwtAuthGuard)
  @Public()
  @Get('/')
  getProducts() {
    return this.productsService.getProducts();
  }
  //상품상세조회, 서비스는 아이디고 여기는 프로덕트 아이디인게 꼬인거 같다
  @Public()
  @Get('/:productId')
  findProduct(@Param('productId') productId: number) {
    return this.productsService.getProductById(productId);
  }

  //상품등록,이미지도 넣어야함
  // @Public()
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // createProduct(
  //   @Cookies('Authentication') jwt: JwtDecodeDto,
  //   @Body() data: CreateProductDto,
  // ) {
  //   console.log('jwt:', jwt);
  //   // console.log('jwt.id:', jwt.id);
  //   // if (!jwt || !jwt.id) {
  //     if (!jwt) {
  //     throw new BadRequestException('Invalid JWT');
  //   }
  //   return this.productsService.createProduct(
  //     data.title,
  //     data.description,
  //     data.price,
  //     data.categoryId,
  //     jwt.id,
  //   );

  // @Public()
  @Post("1")
  async createProduct(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Body() data: CreateProductDto,
  ) {
    console.log('jwt:', jwt);
    // console.log('jwt.id:', jwt.id);
    // if (!jwt || !jwt.id) {
      if (!jwt) {
      throw new BadRequestException('Invalid JWT');
    }
    return await this.productsService.createProduct(
      data.title,
      data.description,
      data.price,
      data.categoryId,
      jwt.id,
    );
    //아니고 로그인 담당자한테 물어봐서 셀러 아이디 가져올 방법 확인, 로그인 필요한거 싹다똑같이 넣어줘야함
  }
  //상품수정
  @Put('/:productId')
  updateProduct(
    @Param('productId') productId: number,
    @Body() data: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(
      productId,
      data.title,
      data.description,
      data.price,
      data.categoryId,
      data.sellerId, //이건 어떻게 고쳐야하나
    );
  }
  //상품 삭제 API//스태이터스 바꾸는 걸로 가야한다
  @Delete('/:productId')
  deleteProduct(@Param('productId') productId: number) {
    //이부분에서 상품에서 아이디에 해당하는 걸 하나만 갖고옴,28번 라인 줄을 참조

    // 프로덕트의 셀러아이디와 로그인아이디가 같은지 확인, 다르면 에러처리
    //하고나면 밑에걸 지움
    return this.productsService.deleteProduct(productId);
  }
  //상품 좋아요
  //@Post('products/:productId')
}
