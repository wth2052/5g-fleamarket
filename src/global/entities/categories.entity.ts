import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductsEntity } from './products.entity';

@Entity({ name: 'categories' })
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  createdAt: Date;

  @Column({ default: null })
  deletedAt: Date;

  @OneToMany((type) => ProductsEntity, (products) => products.category)
  products: ProductsEntity[];
}
