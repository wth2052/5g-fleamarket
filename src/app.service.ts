import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from './global/entities/products.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async prDetail(productId: number) {
    const detail = await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.images', 'images')
      .where(`products.id = :id`, { id: productId })
      // .andWhere(`status = :status`, { status: 'sale' })
      .getMany();

    return detail;
  }
}
