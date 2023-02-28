import { Column, Entity, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({ name: 'likes' })
export class LikesEntity {
  @PrimaryColumn()
  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'users_likes', // table name for the junction table of this relation
    joinColumn: {
      name: 'users',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'likes',
      referencedColumnName: 'id',
    },
  })
  userId: UserEntity[];

  @PrimaryColumn()
  productId: string;

  @Column()
  createdAt: Date;

  @Column()
  deletedAt: Date;
}
