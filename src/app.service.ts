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
}
