import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  category_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'text', nullable: true })
  images: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  original_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  group_price: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  stock: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  sales_count: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  view_count: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'tinyint', default: 0 })
  is_hot: number;

  @Column({ type: 'tinyint', default: 0 })
  is_recommend: number;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'text', nullable: true })
  specifications: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  warranty: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;
}

