//export class updateProductDto {}
// import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends CreateProductDto {readonly sellerId: number;}