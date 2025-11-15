import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { GroupBuying } from './group-buying.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', unsigned: true, unique: true })
  leader_id: number;

  @Column({ type: 'int', unsigned: true })
  group_size: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cover_image: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  total_members: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  active_members: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  total_sales: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  total_orders: number;

  @Column({ type: 'tinyint', default: 1, comment: '自动审核成员：1-开启，0-关闭' })
  auto_approve: number;

  @Column({ type: 'tinyint', default: 1, comment: '消息通知：1-开启，0-关闭' })
  notification_enabled: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToOne(() => User, (user) => user.team)
  @JoinColumn({ name: 'leader_id' })
  leader: User;

  @OneToMany(() => User, (user) => user.team)
  members: User[];

  @OneToMany(() => GroupBuying, (group) => group.team)
  group_buyings: GroupBuying[];
}

