import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ProductImagesEntity } from 'src/global/entities/productimages.entity';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImagesEntity)
    private productImagesRepository: Repository<ProductImagesEntity>,
  ) {}

  async ShowMoreImage(productId: number) {
    const productImages = await this.productImagesRepository.find({
      where: { productId },
      select: ['imagePath'],
    });
    return productImages;
  }

  async getImagePath(productId: number) {
    const image = await this.productImagesRepository.findOne({
      where: { productId },
    });
    return image ? image.imagePath : '이미지 없음';
  }
}
