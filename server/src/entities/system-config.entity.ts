import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_configs')
export class SystemConfig {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, comment: '配置键' })
  config_key: string;

  @Column({ type: 'text', nullable: true, comment: '配置值' })
  config_value: string;

  @Column({ type: 'varchar', length: 50, default: 'string', comment: '配置类型' })
  config_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '配置说明' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'general', comment: '配置分类' })
  category: string;

  @Column({ type: 'tinyint', default: 0, comment: '是否公开' })
  is_public: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updated_at: Date;
}

