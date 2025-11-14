import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from './team.entity';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'tinyint', default: 0 })
  gender: number;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'tinyint', default: 0 })
  is_team_leader: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  team_id: number;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  invite_code: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  invited_by: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  balance: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  points: number;

  @Column({ type: 'int', unsigned: true, default: 1 })
  level: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => Team, (team) => team.members)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

