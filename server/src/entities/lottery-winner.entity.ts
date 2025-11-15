import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LotteryRecord } from './lottery-record.entity';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('lottery_winners')
export class LotteryWinner {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  lottery_id: number;

  @Column({ type: 'int', unsigned: true })
  winner_id: number;

  @Column({ type: 'int', unsigned: true })
  order_id: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @ManyToOne(() => LotteryRecord)
  @JoinColumn({ name: 'lottery_id' })
  lottery: LotteryRecord;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'winner_id' })
  winner: User;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

