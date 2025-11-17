import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, nullable: true, name: 'user_id' })
  user_id: number | null; // null表示系统消息，所有用户可见（数据库允许NULL）

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string; // system, order, payment, lottery, etc.

  @Column({ type: 'tinyint', default: 0, name: 'is_read' })
  is_read: number; // 0-未读，1-已读

  @Column({ type: 'tinyint', default: 1 })
  status: number; // 0-禁用，1-启用

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'related_id' })
  related_id: string; // 关联ID（订单号、支付单号等）

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'related_type' })
  related_type: string; // 关联类型

  @Column({ type: 'datetime', nullable: true, name: 'read_at' })
  read_at: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

