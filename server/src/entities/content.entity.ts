import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 20 })
  type: string; // trending, insight, story

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'cover_image' })
  cover_image: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  author: string;

  @Column({ type: 'int', unsigned: true, default: 0, name: 'view_count' })
  view_count: number;

  @Column({ type: 'int', unsigned: true, default: 0, name: 'like_count' })
  like_count: number;

  @Column({ type: 'int', unsigned: true, default: 0, name: 'collect_count' })
  collect_count: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number; // 0-禁用，1-启用

  @Column({ type: 'tinyint', default: 0, name: 'is_recommend' })
  is_recommend: number; // 0-否，1-是

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sort_order: number;

  @Column({ type: 'datetime', nullable: true, name: 'published_at' })
  published_at: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updated_at: Date;
}

