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
import { LikesEntity } from './likes.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class ProductsEntity {
  @ApiProperty()
  @OneToMany(() => ProductImagesEntity, (images) => images.product, {
    cascade: true,
  })
  images: ProductImagesEntity;

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (seller) => seller.products, {
    onDelete: 'CASCADE',
  })
  seller: UserEntity;
  @Column()
  sellerId: number;

  @ApiProperty()
  @ManyToOne(() => CategoriesEntity, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  category: CategoriesEntity;
  @Column()
  categoryId: number;

  @ApiProperty()
  @Column({ default: 0 })
  viewCount: number;

  @ApiProperty()
  @OneToMany(() => LikesEntity, (like) => like.product, { cascade: true })
  likesJoin: LikesEntity[];

  @ApiProperty()
  @Column({ default: 0 })
  likes: number;

  @ApiProperty()
  @Column({ default: 'sale' })
  status: string;
  // 여기 임시수정
  @ApiProperty()
  @Column({ default: 0 })
  dealCount: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ default: null })
  updatedAt?: Date;

  @ApiProperty()
  @Column({ default: null })
  pullUp: Date;

  @ApiProperty()
  @OneToMany((type) => OrdersEntity, (orders) => orders.product, {
    cascade: true,
  })
  orders: OrdersEntity[];
}
