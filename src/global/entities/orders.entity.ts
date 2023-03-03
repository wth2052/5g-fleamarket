import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
<<<<<<< HEAD
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn
=======
  CreateDateColumn,
>>>>>>> 248279616a3318d77d63291dea3acda55ddb6c85
} from 'typeorm';
import { ProductsEntity } from './products.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'orders' })
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductsEntity)
  product: ProductsEntity;
  @Column()
  productId: number;

  @ManyToOne(() => UserEntity, (buyer) => buyer.orders)
  buyer: UserEntity;
  @Column()
  buyerId: number;

  @Column()
  deal: number;

  @Column({ default: 'sale' })
  status: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn({ default: null })
  deleteAt: Date;
}
