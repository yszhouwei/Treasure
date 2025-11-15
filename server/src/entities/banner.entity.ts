import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 500, name: 'image_url' })
  image_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'link_url' })
  link_url: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'link_type' })
  link_type: string;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sort_order: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'datetime', nullable: true, name: 'start_time' })
  start_time: Date;

  @Column({ type: 'datetime', nullable: true, name: 'end_time' })
  end_time: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updated_at: Date;
}

