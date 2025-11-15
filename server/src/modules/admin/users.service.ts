import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BatchUpdateUsersDto } from './dto/batch-update-users.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, pageSize: number = 10, keyword?: string) {
    try {
      console.log('🔍 查询用户列表，参数:', { page, pageSize, keyword });
      
      const skip = (page - 1) * pageSize;
      const where: any = {};

      if (keyword) {
        where.username = Like(`%${keyword}%`);
      }

      const [data, total] = await this.usersRepository.findAndCount({
        where,
        skip,
        take: pageSize,
        order: { created_at: 'DESC' },
      });

      console.log('✅ 查询到用户数据:', { count: data.length, total });

      return {
        data: data.map(user => {
          const { password, ...result } = user;
          return {
            ...result,
            role: user.role || 'user',
            status: user.status === 1 ? 'active' : 'inactive',
            createdAt: user.created_at,
          };
        }),
        total,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('❌ 查询用户列表失败:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const { password, ...result } = user;
    return {
      ...result,
      role: user.role || 'user',
      status: user.status === 1 ? 'active' : 'inactive',
      createdAt: user.created_at,
    };
  }

  async updateStatus(id: number, status: 'active' | 'inactive') {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 不能禁用管理员账号
    if (user.role === 'admin' && status === 'inactive') {
      throw new BadRequestException('不能禁用管理员账号');
    }

    user.status = status === 'active' ? 1 : 0;
    await this.usersRepository.save(user);

    const { password, ...result } = user;
    return {
      ...result,
      role: user.role || 'user',
      status: user.status === 1 ? 'active' : 'inactive',
      createdAt: user.created_at,
    };
  }

  async updateRole(id: number, role: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 不能修改自己的角色
    // 这里需要从请求中获取当前用户ID，暂时跳过

    const validRoles = ['user', 'team_leader', 'admin'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException(`无效的角色：${role}`);
    }

    user.role = role;
    if (role === 'team_leader') {
      user.is_team_leader = 1;
    } else {
      user.is_team_leader = 0;
    }

    await this.usersRepository.save(user);

    const { password, ...result } = user;
    return {
      ...result,
      role: user.role || 'user',
      status: user.status === 1 ? 'active' : 'inactive',
      createdAt: user.created_at,
    };
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 不能删除管理员账号
    if (user.role === 'admin') {
      throw new BadRequestException('不能删除管理员账号');
    }

    // 软删除：将状态设置为禁用
    user.status = 0;
    await this.usersRepository.save(user);

    return { message: '用户已删除' };
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, email, phone, nickname, role } = createUserDto;

    // 检查用户是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username },
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingUser) {
      throw new BadRequestException('用户名、邮箱或手机号已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 生成邀请码（如果需要）
    const inviteCode = this.generateInviteCode();

    // 创建用户
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      email,
      phone,
      nickname: nickname || username,
      role: role || 'user',
      is_team_leader: role === 'team_leader' ? 1 : 0,
      invite_code: inviteCode,
      status: 1,
    });

    const savedUser = await this.usersRepository.save(user);

    const { password: _, ...result } = savedUser;
    return {
      ...result,
      role: savedUser.role || 'user',
      status: savedUser.status === 1 ? 'active' : 'inactive',
      createdAt: savedUser.created_at,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 不能修改管理员账号的角色（除非是其他管理员）
    // 这里暂时允许修改，实际应该检查当前登录用户是否是管理员

    // 检查用户名、邮箱、手机号是否重复
    if (updateUserDto.username || updateUserDto.email || updateUserDto.phone) {
      const whereConditions: any[] = [];
      if (updateUserDto.username) {
        whereConditions.push({ username: updateUserDto.username });
      }
      if (updateUserDto.email) {
        whereConditions.push({ email: updateUserDto.email });
      }
      if (updateUserDto.phone) {
        whereConditions.push({ phone: updateUserDto.phone });
      }

      const existingUser = await this.usersRepository.findOne({
        where: whereConditions,
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('用户名、邮箱或手机号已存在');
      }
    }

    // 更新字段
    if (updateUserDto.username !== undefined) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.phone !== undefined) {
      user.phone = updateUserDto.phone;
    }
    if (updateUserDto.nickname !== undefined) {
      user.nickname = updateUserDto.nickname;
    }
    if (updateUserDto.password !== undefined) {
      // 加密新密码
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
      // 如果设置为团队长，更新 is_team_leader
      if (updateUserDto.role === 'team_leader') {
        user.is_team_leader = 1;
      } else {
        user.is_team_leader = 0;
      }
    }

    await this.usersRepository.save(user);

    const { password: _, ...result } = user;
    return {
      ...result,
      role: user.role || 'user',
      status: user.status === 1 ? 'active' : 'inactive',
      createdAt: user.created_at,
    };
  }

  async batchUpdate(batchUpdateDto: BatchUpdateUsersDto) {
    const { ids, status, role } = batchUpdateDto;

    if (!ids || ids.length === 0) {
      throw new BadRequestException('请选择要更新的用户');
    }

    // 检查是否有管理员账号
    const users = await this.usersRepository.find({
      where: { id: In(ids) },
    });

    const adminUsers = users.filter(u => u.role === 'admin');
    if (adminUsers.length > 0 && status === 'inactive') {
      throw new BadRequestException('不能批量禁用管理员账号');
    }

    // 批量更新
    const updateData: any = {};
    if (status !== undefined) {
      updateData.status = status === 'active' ? 1 : 0;
    }
    if (role !== undefined) {
      updateData.role = role;
      updateData.is_team_leader = role === 'team_leader' ? 1 : 0;
    }

    await this.usersRepository.update(
      { id: In(ids) },
      updateData,
    );

    return {
      message: `成功更新 ${ids.length} 个用户`,
      count: ids.length,
    };
  }

  async batchDelete(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('请选择要删除的用户');
    }

    // 检查是否有管理员账号
    const users = await this.usersRepository.find({
      where: { id: In(ids) },
    });

    const adminUsers = users.filter(u => u.role === 'admin');
    if (adminUsers.length > 0) {
      throw new BadRequestException('不能删除管理员账号');
    }

    // 批量软删除：将状态设置为禁用
    await this.usersRepository.update(
      { id: In(ids) },
      { status: 0 },
    );

    return {
      message: `成功删除 ${ids.length} 个用户`,
      count: ids.length,
    };
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

