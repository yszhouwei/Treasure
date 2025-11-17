import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SystemConfig } from '../../entities/system-config.entity';
import { OperationLog } from '../../entities/operation-log.entity';
import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(SystemConfig)
    private configRepository: Repository<SystemConfig>,
    @InjectRepository(OperationLog)
    private logRepository: Repository<OperationLog>,
  ) {}

  // 系统配置相关方法
  async findAllConfigs(category?: string): Promise<SystemConfig[]> {
    const where: any = {};
    if (category) {
      where.category = category;
    }
    return this.configRepository.find({
      where,
      order: { category: 'ASC', config_key: 'ASC' },
    });
  }

  async findConfigByKey(key: string): Promise<SystemConfig> {
    const config = await this.configRepository.findOne({
      where: { config_key: key },
    });
    if (!config) {
      throw new NotFoundException(`配置项 ${key} 不存在`);
    }
    return config;
  }

  async createConfig(createDto: CreateSystemConfigDto): Promise<SystemConfig> {
    const config = this.configRepository.create(createDto);
    return this.configRepository.save(config);
  }

  async updateConfig(id: number, updateDto: UpdateSystemConfigDto): Promise<SystemConfig> {
    const config = await this.configRepository.findOne({ where: { id } });
    if (!config) {
      throw new NotFoundException(`配置项 ID ${id} 不存在`);
    }
    Object.assign(config, updateDto);
    return this.configRepository.save(config);
  }

  async updateConfigByKey(key: string, value: string): Promise<SystemConfig> {
    const config = await this.findConfigByKey(key);
    config.config_value = value;
    return this.configRepository.save(config);
  }

  async deleteConfig(id: number): Promise<{ message: string }> {
    const result = await this.configRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`配置项 ID ${id} 不存在`);
    }
    return { message: `配置项 ID ${id} 删除成功` };
  }

  // 操作日志相关方法
  async findAllLogs(
    page: number = 1,
    pageSize: number = 20,
    module?: string,
    action?: string,
    username?: string,
  ): Promise<{ data: OperationLog[]; total: number; page: number; pageSize: number }> {
    const where: any = {};
    if (module) {
      where.module = module;
    }
    if (action) {
      where.action = Like(`%${action}%`);
    }
    if (username) {
      where.username = Like(`%${username}%`);
    }

    const [data, total] = await this.logRepository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data, total, page, pageSize };
  }

  async findLogById(id: number): Promise<OperationLog> {
    const log = await this.logRepository.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException(`日志 ID ${id} 不存在`);
    }
    return log;
  }

  async createLog(logData: Partial<OperationLog>): Promise<OperationLog> {
    const log = this.logRepository.create(logData);
    return this.logRepository.save(log);
  }

  async deleteLog(id: number): Promise<{ message: string }> {
    const result = await this.logRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`日志 ID ${id} 不存在`);
    }
    return { message: `日志 ID ${id} 删除成功` };
  }

  async deleteLogsByDate(beforeDate: Date): Promise<{ message: string; deleted: number }> {
    const result = await this.logRepository
      .createQueryBuilder()
      .delete()
      .where('created_at < :date', { date: beforeDate })
      .execute();
    return { message: '日志清理成功', deleted: result.affected || 0 };
  }

  // 获取日志统计
  async getLogStats() {
    const total = await this.logRepository.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.logRepository
      .createQueryBuilder('log')
      .where('log.created_at >= :today', { today })
      .getCount();
    const modules = await this.logRepository
      .createQueryBuilder('log')
      .select('log.module', 'module')
      .addSelect('COUNT(*)', 'count')
      .where('log.module IS NOT NULL')
      .groupBy('log.module')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
    return { total, todayCount, modules };
  }
}

