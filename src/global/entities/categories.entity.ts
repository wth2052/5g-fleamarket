import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'categories' })
export class CategoriesEntity {
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
