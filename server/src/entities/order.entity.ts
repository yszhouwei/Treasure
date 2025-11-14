import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Team } from './team.entity';
import { Product } from './product.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  order_no: string;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  team_id: number;

  @Column({ type: 'int', unsigned: true })
  product_id: number;

  @Column({ type: 'varchar', length: 200 })
  product_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  product_image: string;

  @Column({ type: 'int', unsigned: true, default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  actual_amount: number;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  payment_method: string;

  @Column({ type: 'datetime', nullable: true })
  payment_time: Date;

  @Column({ type: 'text', nullable: true })
  shipping_address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shipping_company: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shipping_no: string;

  @Column({ type: 'datetime', nullable: true })
  shipping_time: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_time: Date;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

