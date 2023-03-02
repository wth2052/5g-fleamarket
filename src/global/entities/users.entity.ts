import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LikesEntity } from './likes.entity';
import { OrdersEntity } from './orders.entity';
import { ProductsEntity } from './products.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ default: 0 })
  ban: number;

  @OneToMany(() => OrdersEntity, (orders) => orders.buyer)
  orders: OrdersEntity[];

  @OneToMany(() => ProductsEntity, (product) => product.seller)
  products: ProductsEntity[];
}
