import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LotteryRecord } from './lottery-record.entity';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('dividends')
export class Dividend {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  lottery_id: number;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'int', unsigned: true })
  order_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dividend_type: string; // winner/participant/leader

  @Column({ type: 'tinyint', default: 0 })
  status: number; // 0-待发放，1-已发放

  @Column({ type: 'datetime', nullable: true })
  paid_at: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => LotteryRecord)
  @JoinColumn({ name: 'lottery_id' })
  lottery: LotteryRecord;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

