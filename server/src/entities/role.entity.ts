import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '角色代码' })
  role_code: string;

  @Column({ type: 'varchar', length: 100, comment: '角色名称' })
  role_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '角色描述' })
  description: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态' })
  status: number;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort_order: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}

