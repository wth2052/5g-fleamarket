import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn, ManyToMany, ManyToOne,
  OneToOne,
  PrimaryColumn
} from "typeorm";
import { ProductsEntity } from './products.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'likes' })
export class LikesEntity {
  @ManyToMany(() => UserEntity, (users) => users.likes)
  user: UserEntity;
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => ProductsEntity, (product) => product.likes)
  product: ProductsEntity;
  @PrimaryColumn()
  productId: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date;
}
