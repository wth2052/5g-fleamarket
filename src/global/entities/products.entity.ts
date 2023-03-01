import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { CategoriesEntity } from './categories.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'products' })
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @OneToOne(() => UserEntity)
  sellerId: number;

  @OneToOne(() => CategoriesEntity)
  categoryId: number;

  @Column()
  viewCount: number;

  @Column()
  likes: number;

  @Column()
  createdAt: Date;

  @Column()
  deletedAt: Date;
}
