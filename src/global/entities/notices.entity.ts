import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AdminsEntity } from './admins.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'notices' })
export class NoticesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne((type) => AdminsEntity)
  adminId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: null})
  createdAt: string;

  @Column({ default: null })
  deletedAt: string;
}
