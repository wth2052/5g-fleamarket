import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductsEntity } from './products.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'orders' })
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductsEntity)
  product: ProductsEntity;

  @ManyToOne(() => UserEntity, (buyer) => buyer.orders)
  @JoinColumn({ referencedColumnName: 'id' })
  buyer: UserEntity;

  @Column()
  deal: number;

  @Column({ default: 'sale' })
  status: string;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @Column({ default: null })
  deleteAt: Date;
}
