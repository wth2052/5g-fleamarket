import _ from 'lodash';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { CategoriesEntity } from 'src/global/entities/categories.entity';
import { UserEntity } from 'src/global/entities/users.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    @InjectRepository(CategoriesEntity)
    private categoriesEntity: Repository<CategoriesEntity>,
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
  ){}
//사진은 아직 안함, crud먼저
  async getProducts(){
    await this.productRepository.find({
      where: { deletedAt: null},
      select: ['id','title','price','sellerId','viewCount','likes','createdAt']
    });//셀러아이디에 조인되는 닉네임 뿌려야
  } 

  async getProductById(id: number) {
    return await this.productRepository.findOne({
      where: { id: id, deletedAt: null },
      select: ['id', 'title','description','price','sellerId','viewCount','likes','createdAt']
    });
  }
//사진은 아직 안함, crud먼저//뭐 더 들어가야함? 모름

//상품드록, 이미지 여기서 넣어야한다
  async createProduct(title: string, description: string, price: number, categoryId: number){
    this.productRepository.insert({
      title,
      description,
      price,
      categoryId,

    });
  }
  
  //얘도 이미지
  async updateProduct(id: number,title: string, description: string, price: number, sellerId: number, categoryId: number){
    await this.verifySomething(id, sellerId);

    this.productRepository.update(id,{title,description,price,categoryId});
  }
//로그인 된 사용자를 넣어줘야
  async deleteProduct(id: number){
    // await this.verifySomething(id);

    this.productRepository.softDelete(id);
  }

  //보류
  async verifySomething(id: number,sellerId: number){
    const product = await this.productRepository.findOne({
      where: { id: id, deletedAt: null },
      select: ['sellerId'],
    });

    if (_.isNil(product)) {
      throw new NotFoundException(`찾으시는 판매글이 없습니다 sellerId: ${sellerId}님`);
    }
    if (product.sellerId!==sellerId){
      throw new UnauthorizedException(`sellerId: ${sellerId}님의 판매글이 아닙니다`);
    }
  }

}
