import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  parent_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  icon: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}

