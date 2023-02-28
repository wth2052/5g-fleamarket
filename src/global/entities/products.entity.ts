import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToMany(() => UserEntity, (user) => user.id)

  @ManyToMany(() => UserEntity, {})
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
