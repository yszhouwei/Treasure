import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('operation_logs')
export class OperationLog {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, nullable: true, comment: '操作用户ID' })
  user_id: number;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '操作用户名' })
  username: string;

  @Column({ type: 'varchar', length: 100, comment: '操作动作' })
  action: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '操作模块' })
  module: string;

  @Column({ type: 'varchar', length: 10, nullable: true, comment: 'HTTP方法' })
  method: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '请求路径' })
  path: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'IP地址' })
  ip: string;

  @Column({ type: 'text', nullable: true, comment: '用户代理' })
  user_agent: string;

  @Column({ type: 'json', nullable: true, comment: '请求数据' })
  request_data: any;

  @Column({ type: 'json', nullable: true, comment: '响应数据' })
  response_data: any;

  @Column({ type: 'int', nullable: true, comment: '响应状态码' })
  status_code: number;

  @Column({ type: 'int', nullable: true, comment: '执行时间（毫秒）' })
  execution_time: number;

  @Column({ type: 'text', nullable: true, comment: '错误信息' })
  error_message: string;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;
}

