import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';


@Injectable()
export class ProductsService {
  getProducts(){} 

  createProduct(){}

  findProduct(){}

  updateProduct(){}

  deleteProduct(){}

}
