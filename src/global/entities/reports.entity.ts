import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { UserEntity } from './users.entity';
  
  @Entity({ name: 'reports' })
  export class ReportsEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => UserEntity, (reporter) => reporter.reports)
    reporter: UserEntity;
    @Column()
    reporterId: number;

    @Column()
    reported: string;
  
    @Column()
    title: string;

    @Column()
    description: string;
  
    @Column({ default: 0 })
    status: number;
  
    @CreateDateColumn()
    createAt: Date;
  
    @UpdateDateColumn({ default: null })
    updateAt?: Date;
  
    @DeleteDateColumn({ default: null })
    deleteAt?: Date;
  }