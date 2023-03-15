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
  UseInterceptors
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductImagesService } from "./product-images.service";
import { UpdateProductDto } from "./dto/update-product.dto";
import { DeleteProductDto } from "./dto/delete-product.dto";
import { Public } from "src/global/common/decorator/skip-auth.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Cookies } from "src/global/common/decorator/find-cookie.decorator";
import { JwtDecodeDto } from "../user/dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";
import { ApiQuery } from "@nestjs/swagger";

@Controller('productss')
export class ProductsController {
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
      return { products, totalProducts };
    } catch (error) {
      return error;
    }
  }

  //상품 상세 보기
  @Public()
  @Get('view/:productId')
  @Render('product/products-detail.ejs')
  findProduct(@Param('productId') productId: number) {
    return this.productsService.getProductById(productId);
  }
  //상품등록페이지 렌더용
  @UseGuards(JwtAuthGuard)
  @Get('up')
  @Render('product/products-upload.ejs')
  createProductForm() {
    return {};
  }

  // 상품등록/
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }], {
      storage: diskStorage({
        destination: (req, file, callback) => {
          // console.log('File upload destination:', './tmp');
          callback(null, './tmp');
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const extension = extname(file.originalname);
          // console.log('File upload filename:', `${uniqueSuffix}${extension}`);
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          // console.log('Invalid file type:', file.originalname);
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        if (file.size > 1024 * 1024 * 5) {
          // console.log('File size exceeds the limit:', file.originalname);
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
      );

      for (const image of images) {
        const { path, filename } = image;
        await this.ProductImagesService.saveProductImage(
          product.id,
          path,
          filename,
        );
      }

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
  deleteProduct(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Param('productId') productId: number,
    @Body() data: DeleteProductDto,
  ) {
    if (!jwt || !jwt.id) {
      throw new BadRequestException('Invalid JWT');
    }

    return this.productsService.deleteProduct(productId, jwt.id);
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
