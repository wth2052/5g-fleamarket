import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ProductsEntity } from './products.entity';

@Entity({ name: 'productimages' })
export class ProductImagesEntity {
  length: number;
  map(arg0: (image: any) => { imagePath: any; }) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => ProductsEntity, (products) => products.images, {onDelete: 'CASCADE'})
  productId: number;

  @Column()
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date;

}