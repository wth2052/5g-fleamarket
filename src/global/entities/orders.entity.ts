import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
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
