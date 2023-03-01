import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ProductsEntity } from './products.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'orders' })
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductsEntity)
  productId: number;

  @ManyToOne(() => UserEntity)
  buyerId: number;

  @Column()
  deal: number;

  @Column({ default: 'sale' })
  status: string;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @Column()
  deleteAt: Date;
}
