import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  sellerId: number;

  @Column()
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
