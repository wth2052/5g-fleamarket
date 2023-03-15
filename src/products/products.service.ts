import _ from 'lodash';
import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { CategoriesEntity } from 'src/global/entities/categories.entity';
import { UserEntity } from 'src/global/entities/users.entity';
import { DataSource, FindOperator, getConnection, Repository } from 'typeorm';
import { ProductImagesEntity } from 'src/global/entities/productimages.entity';
import * as fs from 'fs';
import * as path from 'path';
import { ProductImagesService } from './product-images.service';
import { LikesEntity } from '../global/entities/likes.entity';

@Injectable()
export class ProductsService {
  constructor(
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
      ],
      relations: ['category', 'seller', 'images', 'likesJoin'],
    });
    console.log('####################', product);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.viewCount += 1;
    await this.productRepository.save(product);

    // product.likesJoin.length

    const {
      category: { name },
      seller: { nickname },
      images: { imagePath },
    } = product;

    const images = product.images.map((image) => ({
      imagePath: image.imagePath,
    }));

    return {
      product: {
        ...product,
        category: { name },
        seller: { nickname },
        images: images,
      },
    };
  }

  async createProduct(
    title: string,
    description: string,
    price: number,
    categoryId: number,
    sellerId: number,
  ) {
    const user = await this.userEntity.findOne({ where: { id: sellerId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = new ProductsEntity();
    product.title = title;
    product.description = description;
    product.price = price;
    product.category = category;
    product.seller = user;

    return await this.productRepository.save(product);
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

    this.productRepository.update(id, {
      status: 'soldout',
    });
  }

  async verifySomething(id: number, sellerId: number) {
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
      throw new UnauthorizedException(
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
}
