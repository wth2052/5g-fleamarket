import _ from 'lodash';
import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { CategoriesEntity } from 'src/global/entities/categories.entity';
import { UserEntity } from 'src/global/entities/users.entity';
import { Connection, DataSource, FindOperator, Repository } from 'typeorm';
import { ProductImagesEntity } from 'src/global/entities/productimages.entity';
import * as fs from 'fs';
import * as path from 'path';
import { ProductImagesService } from './product-images.service';
import { LikesEntity } from '../global/entities/likes.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly connection: Connection,
    private productImagesService: ProductImagesService,
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
    @InjectRepository(ProductImagesEntity)
    private productImagesRepository: Repository<ProductImagesEntity>,
    @InjectRepository(LikesEntity)
    private likeRepository: Repository<LikesEntity>,
    private dataSource: DataSource,
  ) {}

  async getAllProducts(limit: number, offset: number) {
    const products = await this.productRepository.find({
      where: { status: 'sale' },
      take: limit,
      skip: offset,
      relations: ['category', 'images'],
      order: { updatedAt: 'DESC' },
    });
    if (products.length === 0) {
      throw new NotFoundException('상품이 존재하지 않습니다.');
    } else {
      return products;
    }
  }
  async getTotalProducts() {
    return this.productRepository.count();
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'title',
        'description',
        'price',
        'sellerId',
        'categoryId',
        'viewCount',
        'likes',
        'createdAt',
        'pullUp',
        'status'
      ],
      relations: ['category', 'seller', 'images', 'likesJoin'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.viewCount += 1;
    await this.productRepository.save(product);
    console.log('####################', product, '###########');
    return { product };
  }

  async createProduct(
    title: string,
    description: string,
    price: number,
    categoryId: number,
    sellerId: number,
    images: Express.Multer.File[], // 이미지 배열을 받아옵니다.
  ) {
    // 글 저장
    const product = new ProductsEntity();
    product.title = title;
    product.description = description;
    product.price = price;
    product.categoryId = categoryId;
    product.sellerId = sellerId;

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(UserEntity, {
        where: { id: sellerId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const category = await queryRunner.manager.findOne(CategoriesEntity, {
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // 글 저장
      const savedProduct = await queryRunner.manager.save(product);

      // 이미지 처리
      for (const image of images) {
        const imageFilename = image.filename;
        const finalImagePath = path.join(
          '.',
          'src',
          'public',
          'img',
          imageFilename,
        );
        // 경로가 없으면 생성
        if (!fs.existsSync(path.dirname(finalImagePath))) {
          fs.mkdirSync(path.dirname(finalImagePath), { recursive: true });
        }
        //
        const fileStream = fs.createReadStream(image.path);
        const writeStream = fs.createWriteStream(finalImagePath);
        fileStream.pipe(writeStream);

        // ProductImagesEntity 인스턴스 생성
        const productImage = new ProductImagesEntity();
        productImage.productId = savedProduct.id;
        productImage.imagePath = imageFilename;

        // ProductImagesEntity 인스턴스 저장
        await queryRunner.manager.save(productImage);
      }

      await queryRunner.commitTransaction();

      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //얘도 이미지
  async updateProduct(
    id: number,
    title: string,
    description: string,
    price: number,
    categoryId: number,
    sellerId: number,
  ) {
    await this.verifySomething(id, sellerId);

    this.productRepository.update(id, {
      title,
      description,
      price,
      categoryId,
    });
  }
  async deleteProduct(id: number, sellerId: number) {
    await this.verifySomething(id, sellerId);

    await this.connection.transaction(async (manager) => {
      await manager.update(
        ProductImagesEntity,
        { productId: id },
        { deletedAt: new Date() },
      );
      await manager.update(ProductsEntity, id, { status: 'deleted' });
    });

    // if (error instanceof NotFoundException) {
    // throw new NotFoundException('Product not found');
    // }
  }

  async verifySomething(id: number, sellerId: number) {
    if (!sellerId) {
      throw new BadRequestException('Invalid sellerId');
    }

    const product = await this.productRepository.findOne({
      where: { id: id, status: 'sale' },
      select: ['sellerId'],
    });

    if (product == null) {
      throw new NotFoundException(
        `찾으시는 판매글이 없습니다 sellerId: ${sellerId}님`,
      );
    }
    if (product.sellerId !== sellerId) {
      throw new ForbiddenException(
        `sellerId: ${sellerId}님의 판매글이 아닙니다`,
      );
    }
  }

  // 찜하기 ?? if 문으로 써도 되지않을까?
  async likeProduct(productId: number, userId: number) {
    // 찜했는지 확인
    const like = await this.likeRepository.findOne({
      where: {
        productId: productId,
        userId: userId,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!like) {
        // 찜 안했으면 찜하기
        await this.likeRepository.save({
          productId: productId,
          userId: userId,
        });
        // 찜하기 +1
        await this.productRepository.update(
          { id: productId },
          { likes: () => 'likes + 1' },
        );
      } else {
        // 찜 했으면 찜 취소(삭제)
        const product = await this.productRepository.findOne({
          where: { id: productId },
        });
        await this.likeRepository.delete({
          productId: productId,
          userId: userId,
        });
        await this.productRepository.update(
          { id: productId },
          { likes: () => 'likes - 1' },
        );
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //등록창 카테고리 불러오기용
  async getCategories(): Promise<CategoriesEntity[]> {
    return await this.categoriesRepository.find();
  }
}
