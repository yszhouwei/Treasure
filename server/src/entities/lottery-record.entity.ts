import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { GroupBuying } from './group-buying.entity';
import { Product } from './product.entity';
import { LotteryWinner } from './lottery-winner.entity';

@Entity('lottery_records')
export class LotteryRecord {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  group_id: number;

  @Column({ type: 'int', unsigned: true })
  product_id: number;

  @Column({ type: 'int', unsigned: true, default: 1 })
  winner_count: number; // 中奖数量（平台设定）

  @Column({ type: 'datetime', nullable: true })
  lottery_time: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lottery_method: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number; // 0-未开奖，1-已开奖

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => GroupBuying)
  @JoinColumn({ name: 'group_id' })
  group: GroupBuying;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => LotteryWinner, (winner) => winner.lottery)
  winners: LotteryWinner[];
}

