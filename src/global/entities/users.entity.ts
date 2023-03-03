import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
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

  // refresh token 저장
  @Column({
    nullable: true,
  })
  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;
}
