import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoriesEntity } from './categories.entity';
import { UserEntity } from './users.entity';
import { OrdersEntity } from './orders.entity';
import { ProductImagesEntity } from './productimages.entity';

@Entity({ name: 'products' })
export class ProductsEntity {
  @OneToMany(() => ProductImagesEntity, (images) => images.productId)
  images: ProductImagesEntity
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => UserEntity, (seller) => seller.products)
  seller: UserEntity;
  @Column()
  sellerId: number;

  @ManyToOne(() => CategoriesEntity, (category) => category.products)
  category: CategoriesEntity;
  @Column()
  categoryId: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 'sale' })
  status: string;
  // 여기 임시수정
  @Column({ default: 0 })
  dealCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt?: Date;

  @OneToMany((type) => OrdersEntity, (orders) => orders.product)
  orders: OrdersEntity[];
}
