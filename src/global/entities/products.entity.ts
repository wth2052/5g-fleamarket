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
import { LikesEntity } from "./likes.entity";

@Entity({ name: 'products' })
export class ProductsEntity {
  @OneToMany(() => ProductImagesEntity, (images) => images.productId)
  images: ProductImagesEntity;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => UserEntity, (seller) => seller.products, {
    onDelete: 'CASCADE',
  })
  seller: UserEntity;
  @Column()
  sellerId: number;

  @ManyToOne(() => CategoriesEntity, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  category: CategoriesEntity;
  @Column()
  categoryId: number;

  @Column({ default: 0 })
  viewCount: number;

  @OneToMany(() => LikesEntity, (like) => like.product)
  likesJoin: LikesEntity[];

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

  @Column({ default: null })
  pullUp: Date;

  @OneToMany((type) => OrdersEntity, (orders) => orders.product, {
    cascade: true,
  })
  orders: OrdersEntity[];
}
