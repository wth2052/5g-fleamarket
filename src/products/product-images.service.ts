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

  // async saveProductImage(productId: number, images): Promise<void> {
  //   // 이미지 파일을 저장할 경로 설정
  //   const finalImagePath = path.join(__dirname, './uploads', images.filename);

  //   // 임시 폴더에서 최종 저장 경로로 파일 이동
  //   await fs.promises.rename(path.join(__dirname, './tmp', images.filename), finalImagePath);
  async saveProductImage(productId: number, imageFilename: string): Promise<void> {
    // 이미지 파일을 저장할 경로 설정
    const finalImagePath = path.join(__dirname, './uploads', imageFilename);

    // 임시 폴더에서 최종 저장 경로로 파일 이동
    await fs.promises.rename(imageFilename, finalImagePath);

    // ProductImagesEntity 인스턴스 생성
    const productImage = new ProductImagesEntity();
    productImage.productId = productId;
    productImage.imagePath = finalImagePath;

    // ProductImagesEntity 인스턴스 저장
    await this.productImagesRepository.save(productImage); 
  } 

}