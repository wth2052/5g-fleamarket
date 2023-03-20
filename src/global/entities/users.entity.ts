import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { LikesEntity } from './likes.entity';
import { OrdersEntity } from './orders.entity';
import { ProductsEntity } from './products.entity';
import { ReportsEntity } from './reports.entity';

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

  @Column({ default: 0 })
  warning: number;

  // refresh token 저장
  @Column({
    nullable: true,
  })
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn({ default: null })
  updatedAt?: Date;
  @DeleteDateColumn()
  deletedAt?: Date | null;

  @OneToMany(() => OrdersEntity, (orders) => orders.buyer, { cascade: true })
  orders: OrdersEntity[];

  @OneToMany(() => ProductsEntity, (products) => products.seller, {
    cascade: true,
  })
  products: ProductsEntity[];


  @OneToMany(() => LikesEntity, (like) => like.user)
  likes: LikesEntity[];

  @OneToMany(() => ReportsEntity, (reports) => reports.reporter)
  reports: ReportsEntity[];
}

