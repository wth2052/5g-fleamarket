import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({ name: 'notices' })
export class NoticesEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @ManyToOne((type) => UserEntity, (user) => user.id)
  adminId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  createdAt: string;

  @Column()
  deletedAt: string;
}
