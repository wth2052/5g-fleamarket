import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { NoticesEntity } from './notices.entity';

@Entity({ name: 'admins' })
export class AdminsEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  loginId: string;

  @Column()
  loginPw: string;
}
