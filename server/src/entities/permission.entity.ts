import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, comment: '权限代码' })
  permission_code: string;

  @Column({ type: 'varchar', length: 100, comment: '权限名称' })
  permission_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '权限描述' })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '所属模块' })
  module: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '资源' })
  resource: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '操作' })
  action: string;

  @Column({ type: 'int', unsigned: true, default: 0, comment: '父权限ID' })
  parent_id: number;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort_order: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}

