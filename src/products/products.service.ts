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
    private dataSource: DataSource,
  ) {}


  async getAllProducts(limit: number, offset: number) {
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: ['category', 'images'],
      order: { updatedAt: 'DESC' },
    });
    console.log('!^%*&^@*&$', limit);
    console.log('!^%*&^@*&$', offset);
    console.log('!^%*&^@*&$', products);
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
      where: { id: id, status: 'sale' },
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
      relations: ['category', 'seller', 'images'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

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
    const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
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
}
