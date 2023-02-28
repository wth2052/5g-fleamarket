import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'productimages' })
export class ProductImagesEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  productsId: number;

  @Column()
  imagePath: string;

  @Column()
  createdAt: Date;

  @Column()
  deletedAt: Date;
}
