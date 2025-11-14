import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from './team.entity';
import { Product } from './product.entity';

@Entity('group_buying')
export class GroupBuying {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  group_no: string;

  @Column({ type: 'int', unsigned: true })
  product_id: number;

  @Column({ type: 'int', unsigned: true })
  team_id: number;

  @Column({ type: 'int', unsigned: true })
  leader_id: number;

  @Column({ type: 'int', unsigned: true })
  group_size: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  current_members: number;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ type: 'datetime', nullable: true })
  start_time: Date;

  @Column({ type: 'datetime', nullable: true })
  end_time: Date;

  @Column({ type: 'datetime', nullable: true })
  success_time: Date;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => Team, (team) => team.group_buyings)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

