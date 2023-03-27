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
import { CreateProductDto } from './dto/create-product.dto';
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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes, ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";
import * as fs from 'fs';
import axios from 'axios';
import { Response } from 'express';
import { Redirect, Res } from '@nestjs/common/decorators';

@ApiTags('상품 API')
@Controller('/api/products')
export class ProductsController {
  categoriesRepository: any;
  constructor(
    private readonly productsService: ProductsService,
    private readonly ProductImagesService: ProductImagesService,
  ) {}
  //상품목록조회
  @ApiOperation({
    summary: '상품 전체 목록보기',
    description: '유저가 상품 전체 목록을 요청합니다.',
  })
  @ApiOkResponse({ description: '상품 전체 목록 확인.' })
  @ApiNotFoundResponse({ description: '상품이 없습니다.' })
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

  //상품 상세 보기
  @ApiOperation({
    summary: '상품 상세보기',
    description: '유저가 상품 상세 정보를 요청합니다.',
  })
  @ApiOkResponse({ description: '상품 상세 정보 확인.' })
  @ApiNotFoundResponse({ description: '해당 상품이 없습니다.' })
  @ApiParam({
    name: 'productId',
    type: 'number',
  })
  @Public()
  @Get('view/:productId')
  // @Render('product/products-detail.ejs')
  findProduct(@Param('productId') productId: number) {
    return this.productsService.getProductById(productId);
  }

  @ApiOperation({ summary: '상품 등록' })
  @ApiOkResponse({ description: '카테고리 확인' })
  @ApiNotFoundResponse({ description: '카테고리가 없습니다.' })
  @UseGuards(JwtAuthGuard)
  @Get('category')
  // @Render('product/product-create.ejs')
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
  @ApiOperation({
    summary: '상품 등록하기',
    description: '유저가 상품 등록 요청합니다',
  })
  @ApiOkResponse({ description: '상품 등록 성공' })
  @ApiNotFoundResponse({ description: '상품 등록 실패' })
  @ApiBadRequestResponse({ description: '사진을 다시 등록해주세요' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '상품 등록 요청',
    type: CreateProductDto,
    required: true,
  })
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

  //상품삭제
  @ApiOperation({
    summary: '상품 삭제하기',
    description: '해당상품을 작성한 유저가 상품 삭제 요청합니다',
  })
  @ApiOkResponse({ description: '상품 삭제 성공' })
  @ApiNotFoundResponse({ description: '상품 삭제 실패' })
  @ApiBadRequestResponse({ description: '본인이 작성한 상품이 아닙니다.' })
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
  @ApiOperation({
    summary: '상품 좋아요',
    description: '유저가 해당 상품을 찜하기 요청',
  })
  @ApiOkResponse({ description: '상품 찜하기 성공' })
  @ApiNotFoundResponse({ description: '상품 찜하기 실패' })
  @ApiForbiddenResponse({ description: '해당유저님의 판매글이 아닙니다.' })
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
