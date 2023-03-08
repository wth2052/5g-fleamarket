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
import { Cookies } from 'src/global/common/decorator/find-cookie.decorator';
import { JwtDecodeDto } from 'src/orders/dto/jwtdecode-order.dto';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';

@Controller('productss')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  //상품목록조회
  @Public()
  @Get('/')
  getProducts() {
    return this.productsService.getProducts();
  }

  @Public()
  @Get('/:productId')
  findProduct(@Param('productId') productId: number) {
    return this.productsService.getProductById(productId);
  }
  //상품상세조회
  @UseGuards(JwtAuthGuard)
  @Post('/')
  createProduct(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Body() data: CreateProductDto,
  ) {
    if (!jwt || !jwt.id) {
      throw new BadRequestException('Invalid JWT');
    }
    const userId = jwt.id;
    return this.productsService.createProduct(
      data.title,
      data.description,
      data.price,
      data.categoryId,
      userId,
    );
  }
  //상품수정
  @Put('/:productId')
  updateProduct(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('productId') productId: number,
    @Body() data: UpdateProductDto,
  ) {
    if (!jwt || !jwt.id) {
      throw new BadRequestException('Invalid JWT');
    }
    const userId = jwt.id;
    return this.productsService.updateProduct(
      productId,
      data.title,
      data.description,
      data.price,
      data.categoryId,
      userId, 
    );
  }

  //상품삭제
  @Delete(':productId')
  deleteProduct(    
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('productId') productId: number,
    @Body() data: DeleteProductDto
    ) {
      if (!jwt || !jwt.id) {
        throw new BadRequestException('Invalid JWT');
      }

    return this.productsService.deleteProduct(productId,jwt.id,);
  }
  //상품 좋아요
  //@Post('products/:productId')
}
