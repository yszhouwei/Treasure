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
import { Order } from './order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'payment_no' })
  payment_no: string;

  @Column({ type: 'int', unsigned: true, name: 'order_id' })
  order_id: number;

  @Column({ type: 'varchar', length: 50, name: 'order_no' })
  order_no: string;

  @Column({ type: 'int', unsigned: true, name: 'user_id' })
  user_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 20, name: 'payment_method' })
  payment_method: string; // wechat, alipay, bank

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'payment_channel' })
  payment_channel: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'third_party_no' })
  third_party_no: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number; // 0-待支付，1-支付成功，2-支付失败，3-已退款

  @Column({ type: 'datetime', nullable: true, name: 'paid_at' })
  paid_at: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'refund_amount' })
  refund_amount: number;

  @Column({ type: 'datetime', nullable: true, name: 'refund_time' })
  refund_time: Date;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

