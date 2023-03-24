import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ProductsEntity } from './products.entity';
import { UserEntity } from './users.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'orders' })
export class OrdersEntity {
  @ApiProperty({ example: 1, description: 'order ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductsEntity, { onDelete: 'CASCADE' })
  product: ProductsEntity;
  @Column()
  productId: number;

  @ManyToOne(() => UserEntity, (buyer) => buyer.orders, { onDelete: 'CASCADE' })
  buyer: UserEntity;
  @Column()
  buyerId: number;

  @Column()
  deal: number;

  @ApiProperty({ example: 'sale', description: 'order status' })
  @Column({ default: 'sale' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt?: Date;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date;
}
