import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductsEntity } from './products.entity';

@Entity({ name: 'productimages' })
export class ProductImagesEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => ProductsEntity)
  productsId: number;

  @Column()
  imagePath: string;

  @Column()
  createdAt: Date;

  @Column()
  deletedAt: Date;
}
