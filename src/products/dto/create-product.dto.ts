import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: '상품 제목', description: '상품 제목' })
  @IsString()
  readonly title: string;

  @ApiProperty({ example: '상품 설명', description: '상품 설명' })
  @IsString()
  readonly description: string;

  @ApiProperty({ example: 10000, description: '상품 가격' })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ example: 1, description: '카테고리 ID' })
  @IsNumber()
  readonly categoryId: number;

  @ApiProperty({ example: 1, description: '판매자 ID' })
  @IsNumber()
  readonly sellerId: number;

  
  @ApiProperty({ description: '상품 이미지 파일 배열', required: true, type: 'array', items: { type: 'string', format: 'binary' } })
  @IsNotEmpty()
  images: Express.Multer.File[];

}