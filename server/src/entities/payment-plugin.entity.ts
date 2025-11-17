import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_plugins')
export class PaymentPlugin {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'plugin_code' })
  plugin_code: string;

  @Column({ type: 'varchar', length: 100, name: 'plugin_name' })
  plugin_name: string;

  @Column({ type: 'varchar', length: 20, name: 'plugin_type' })
  plugin_type: string; // domestic, overseas, crypto

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'icon_url' })
  icon_url: string;

  @Column({ type: 'varchar', length: 20, default: '1.0.0' })
  version: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  author: string;

  @Column({ type: 'json', nullable: true, name: 'config_schema' })
  config_schema: any;

  @Column({ type: 'json', nullable: true, name: 'config_data' })
  config_data: any;

  @Column({ type: 'tinyint', default: 0 })
  status: number; // 0-未安装，1-已安装，2-已启用

  @Column({ type: 'tinyint', default: 0, name: 'is_default' })
  is_default: number;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sort_order: number;

  @Column({ type: 'json', nullable: true, name: 'supported_regions' })
  supported_regions: string[];

  @Column({ type: 'json', nullable: true, name: 'supported_currencies' })
  supported_currencies: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'min_amount' })
  min_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'max_amount' })
  max_amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0, name: 'fee_rate' })
  fee_rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'fee_fixed' })
  fee_fixed: number;

  @Column({ type: 'datetime', nullable: true, name: 'install_time' })
  install_time: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updated_at: Date;
}

