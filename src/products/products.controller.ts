import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  PayloadTooLargeException,
  Post,
  Put,
  Query,
  Render,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductImagesService } from './product-images.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { Public } from 'src/global/common/decorator/skip-auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Cookies } from 'src/global/common/decorator/find-cookie.decorator';
import { JwtDecodeDto } from '../user/dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiQuery } from '@nestjs/swagger';
import * as fs from 'fs';
import axios from 'axios';
import { Response } from 'express';
import { Redirect, Res } from '@nestjs/common/decorators';

@Controller('productss')
export class ProductsController {
  categoriesRepository: any;
  constructor(
    private readonly productsService: ProductsService,
    private readonly ProductImagesService: ProductImagesService,
  ) {}
  //상품목록조회
  @Public()
  @Get('view')
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
  async getProducts(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const products = await this.productsService.getAllProducts(limit, offset);
      const totalProducts = await this.productsService.getTotalProducts();
      console.log(
        'huck',
        `Fetched ${products.length} products from offset ${offset} with limit ${limit}. Total products: ${totalProducts}`,
      );
      return { products, totalProducts };
    } catch (error) {
      return error;
    }
  }

  @Public()
  @Get('asdf/:1')
  @Render('product/products-detail.ejs')
  asdf() {}

  //상품 상세 보기
  @Public()
  @Get('view/:productId')
  // @Render('product/products-detail.ejs')
  findProduct(@Param('productId') productId: number) {
    return this.productsService.getProductById(productId);
  }

  @Get('category')
  async getCategories() {
    const categories = await this.categoriesRepository.find();
    console.log('카테고리', categories);
    return categories;
  }

  //상품등록페이지 렌더용
  @UseGuards(JwtAuthGuard)
  @Get('up')
  @Render('product/products-upload.ejs')
  async createProductForm() {
    const categories = await this.productsService.getCategories();
    return { categories };
  }

  // 상품등록/
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }], {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const tmpFolder = './tmp';
          //tmp없으면 생성
          if (!fs.existsSync(tmpFolder)) {
            fs.mkdirSync(tmpFolder, { recursive: true });
          }
          callback(null, tmpFolder);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        if (file.size > 1024 * 1024 * 5) {
          return callback(
            new PayloadTooLargeException('File size exceeds the limit'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post('up')
  async createProduct(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Body() payload: any, // payload 타입을 any로 설정합니다
    @UploadedFiles() rawImages: Record<string, Array<Express.Multer.File>>,
  ) {
    try {
      let images = rawImages.images;

      // console.log('Create product called with payload:', payload);
      if (!jwt || !jwt.id) {
        throw new BadRequestException('Invalid JWT');
      }

      const { title, description, price, categoryId } = payload;
      if (price < 0) {
        throw new BadRequestException('Price should be a positive value');
      }

      if (!Array.isArray(images)) {
        images = [images];
      }
      if (!images || images.length === 0) {
        throw new BadRequestException('No images provided');
      }

      const userId = jwt.id;
      // console.log('Creating product for user:', userId);
      // product 저장

      const product = await this.productsService.createProduct(
        title,
        description,
        price,
        categoryId,
        userId,
        images,
      );

      return product;
    } catch (error) {
      console.log('Error occurred in createProduct:', error);
      throw error;
    }
  }

  //상품수정 렌더 및 수정하기 폼에서 기존 정보를 불러옴
  @Get('edit/:id')
  @Render('product/product-update.ejs')
  async getEditProductPage(@Param('id') id: number) {
    const product = await this.productsService.getProductById(id);
    return { product };
  }

  //상품수정
  @UseGuards(JwtAuthGuard)
  @Put('edit/:productId')
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
  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async deleteProduct(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('productId') productId: number,
    @Body() data: DeleteProductDto,
  ) {
    console.log('jwt', jwt.id);
    if (!jwt || !jwt.id) {
      throw new BadRequestException('Invalid JWT');
    }

    console.log('kill', productId, jwt.id);

    await this.productsService.deleteProduct(+productId, jwt.id);
    return { success: true };
  }
  //상품 좋아요
  @UseGuards(JwtAuthGuard)
  @Post('like/:productId')
  likeProduct(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('productId') productId: number,
  ) {
    const userId = jwt.id;
    return this.productsService.likeProduct(productId, userId);
  }
}
