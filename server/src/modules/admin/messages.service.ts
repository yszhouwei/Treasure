import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class AdminMessagesService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(type?: string, userId?: number) {
    try {
      const queryBuilder = this.notificationsRepository.createQueryBuilder('notification')
        .leftJoinAndSelect('notification.user', 'user');
      
      if (type) {
        queryBuilder.andWhere('notification.type = :type', { type });
      }
      
      if (userId !== undefined) {
        if (userId === null) {
          // 系统消息（user_id为null）
          queryBuilder.andWhere('notification.user_id IS NULL');
        } else {
          queryBuilder.andWhere('notification.user_id = :userId', { userId });
        }
      }

      queryBuilder.orderBy('notification.created_at', 'DESC')
        .addOrderBy('notification.id', 'DESC');

      const notifications = await queryBuilder.getMany();
      
      console.log('✅ 查询到消息数量:', notifications.length);
      return notifications;
    } catch (error) {
      console.error('❌ 查询消息失败:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!notification) {
      throw new NotFoundException('消息不存在');
    }

    return notification;
  }

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      console.log('📝 创建消息:', createNotificationDto);
      
      const data: any = {
        ...createNotificationDto,
        user_id: createNotificationDto.user_id ?? null,
        type: createNotificationDto.type || 'system',
        status: createNotificationDto.status ?? 1,
        is_read: 0,
        related_id: createNotificationDto.related_id || null,
        related_type: createNotificationDto.related_type || null,
      };
      
      const notification = this.notificationsRepository.create(data);
      const saved = await this.notificationsRepository.save(notification);
      const result = Array.isArray(saved) ? saved[0] : saved;
      console.log('✅ 消息创建成功, ID:', result.id);
      return result;
    } catch (error) {
      console.error('❌ 创建消息失败:', error);
      throw error;
    }
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    try {
      console.log('📝 更新消息, ID:', id, '数据:', updateNotificationDto);
      const notification = await this.findOne(id);
      
      const data: any = {
        ...updateNotificationDto,
      };
      
      if (data.user_id === '') data.user_id = null;
      if (data.related_id === '') data.related_id = null;
      if (data.related_type === '') data.related_type = null;
      
      Object.assign(notification, data);
      const saved = await this.notificationsRepository.save(notification);
      const result = Array.isArray(saved) ? saved[0] : saved;
      console.log('✅ 消息更新成功');
      return result;
    } catch (error) {
      console.error('❌ 更新消息失败:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      console.log('🗑️ 删除消息, ID:', id);
      const notification = await this.notificationsRepository.findOne({ where: { id } });
      if (!notification) {
        throw new NotFoundException('消息不存在');
      }
      await this.notificationsRepository.remove(notification);
      console.log('✅ 消息删除成功, ID:', id);
      return { message: '删除成功', id };
    } catch (error) {
      console.error('❌ 删除消息失败:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`删除消息失败: ${error.message || error}`);
    }
  }

  async getStatistics() {
    try {
      const totalMessages = await this.notificationsRepository.count();
      
      // 统计各类型的消息数
      const typeCounts = await this.notificationsRepository
        .createQueryBuilder('notification')
        .select('notification.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('notification.type')
        .getRawMany();
      
      // 统计未读消息数
      const unreadCount = await this.notificationsRepository.count({
        where: { is_read: 0 },
      });
      
      // 统计系统消息数（user_id为null）
      const systemCount = await this.notificationsRepository.count({
        where: { user_id: null },
      });
      
      const typeMap: Record<string, number> = {};
      typeCounts.forEach(item => {
        typeMap[item.type || 'system'] = parseInt(item.count);
      });

      return {
        total_messages: totalMessages,
        unread_count: unreadCount,
        system_count: systemCount,
        type_counts: typeMap,
      };
    } catch (error) {
      console.error('❌ 查询消息统计失败:', error);
      throw error;
    }
  }
}

