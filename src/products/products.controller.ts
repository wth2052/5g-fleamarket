import { 
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  //상품목록조회
  @Get('products')
  getProducts() {
    return this.productsService.getProducts
  }

  //상품등록
  @Post('products')
  createProduct(){}

  //상품상세조회
  @Get('products/:productId')
  findProduct(@Param('productId') productId: number) {
    return this.productsService.findProduct(productId);
  }
  //상품 좋아요
  //@Post('products/:productId')

  //상품수정
  @Put('products/:productId')
  updateProduct(@Param('productId') productId: number) {
    return this.productsService.updateProduct(productId);
  }
  //상품 삭제 API
  @Delete('/products/:productId')
  deleteProduct(@Param('productId') productId: number){
    return this.productsService.deleteProduct(productId);
  }
}
