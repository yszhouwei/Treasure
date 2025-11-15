import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Team } from '../../entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class AdminTeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, pageSize: number = 10, keyword?: string) {
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    const [data, total] = await this.teamsRepository.findAndCount({
      where,
      relations: ['leader'],
      skip,
      take: pageSize,
      order: { created_at: 'DESC' },
    });

    return {
      data: data.map(team => ({
        id: team.id,
        name: team.name,
        leaderName: team.leader?.nickname || team.leader?.username || '未知',
        leaderId: team.leader_id,
        groupSize: team.group_size,
        totalMembers: team.total_members,
        activeMembers: team.active_members,
        totalSales: parseFloat(String(team.total_sales || 0)),
        totalOrders: team.total_orders,
        status: team.status === 1 ? 'active' : 'inactive',
        createdAt: team.created_at,
      })),
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number) {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['leader', 'members'],
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    return {
      id: team.id,
      name: team.name,
      leaderName: team.leader?.nickname || team.leader?.username || '未知',
      leaderId: team.leader_id,
      groupSize: team.group_size,
      totalMembers: team.total_members,
      activeMembers: team.active_members,
      totalSales: parseFloat(String(team.total_sales || 0)),
      totalOrders: team.total_orders,
      description: team.description,
      region: team.region,
      status: team.status === 1 ? 'active' : 'inactive',
      autoApprove: team.auto_approve === 1,
      notificationEnabled: team.notification_enabled === 1,
      createdAt: team.created_at,
    };
  }

  async create(createTeamDto: CreateTeamDto) {
    // 检查团队长是否存在
    const leader = await this.usersRepository.findOne({
      where: { id: createTeamDto.leaderId },
    });

    if (!leader) {
      throw new NotFoundException('团队长不存在');
    }

    // 检查团队长是否已经是其他团队的团队长
    const existingTeam = await this.teamsRepository.findOne({
      where: { leader_id: createTeamDto.leaderId },
    });

    if (existingTeam) {
      throw new BadRequestException('该用户已经是其他团队的团队长');
    }

    // 设置团队长角色
    leader.role = 'team_leader';
    leader.is_team_leader = 1;
    await this.usersRepository.save(leader);

    // 创建团队
    const team = this.teamsRepository.create({
      name: createTeamDto.name,
      leader_id: createTeamDto.leaderId,
      group_size: createTeamDto.groupSize,
      description: createTeamDto.description,
      region: createTeamDto.region,
      status: 1,
    });

    const savedTeam = await this.teamsRepository.save(team);

    // 更新用户的team_id
    leader.team_id = savedTeam.id;
    await this.usersRepository.save(leader);

    return this.findOne(savedTeam.id);
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.teamsRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    if (updateTeamDto.name !== undefined) {
      team.name = updateTeamDto.name;
    }
    if (updateTeamDto.description !== undefined) {
      team.description = updateTeamDto.description;
    }
    if (updateTeamDto.region !== undefined) {
      team.region = updateTeamDto.region;
    }
    if (updateTeamDto.groupSize !== undefined) {
      team.group_size = updateTeamDto.groupSize;
    }
    if (updateTeamDto.status !== undefined) {
      team.status = updateTeamDto.status === 'active' ? 1 : 0;
    }
    if (updateTeamDto.autoApprove !== undefined) {
      team.auto_approve = updateTeamDto.autoApprove ? 1 : 0;
    }
    if (updateTeamDto.notificationEnabled !== undefined) {
      team.notification_enabled = updateTeamDto.notificationEnabled ? 1 : 0;
    }

    await this.teamsRepository.save(team);
    return this.findOne(id);
  }

  async remove(id: number) {
    const team = await this.teamsRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    // 软删除：将状态设置为禁用
    team.status = 0;
    await this.teamsRepository.save(team);

    return { message: '团队已删除' };
  }
}

