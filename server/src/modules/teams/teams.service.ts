import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../entities/team.entity';
import { GroupBuying } from '../../entities/group-buying.entity';
import { TeamSettingsDto } from './dto/team-settings.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(GroupBuying)
    private groupBuyingRepository: Repository<GroupBuying>,
  ) {}

  async findAll() {
    return this.teamsRepository.find({
      where: { status: 1 },
      relations: ['leader'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id, status: 1 },
      relations: ['leader', 'members'],
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    return team;
  }

  async getTeamOverview(userId: number) {
    const team = await this.teamsRepository.findOne({
      where: { leader_id: userId },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException('您不是团队长');
    }

    // 获取进行中的团购
    const activeGroups = await this.groupBuyingRepository.find({
      where: { team_id: team.id, status: 1 },
      order: { created_at: 'DESC' },
    });

    // 获取待启动的团购
    const upcomingGroups = await this.groupBuyingRepository.find({
      where: { team_id: team.id, status: 0 },
      order: { created_at: 'DESC' },
    });

    return {
      team,
      activeGroups,
      upcomingGroups,
    };
  }

  /**
   * 获取团队设置
   */
  async getTeamSettings(userId: number) {
    const team = await this.teamsRepository.findOne({
      where: { leader_id: userId },
    });

    if (!team) {
      throw new ForbiddenException('您不是团队长，无法访问团队设置');
    }

    // 转换为前端期望的格式
    // 处理可能为 null 的字段，使用默认值
    return {
      teamName: team.name,
      description: team.description || '',
      region: team.region || '',
      autoApprove: team.auto_approve === 1 || team.auto_approve === null,
      notificationEnabled: team.notification_enabled === 1 || team.notification_enabled === null,
    };
  }

  /**
   * 更新团队设置
   */
  async updateTeamSettings(userId: number, settingsDto: TeamSettingsDto) {
    const team = await this.teamsRepository.findOne({
      where: { leader_id: userId },
    });

    if (!team) {
      throw new ForbiddenException('您不是团队长，无法修改团队设置');
    }

    // 更新字段
    // 团队名称验证：如果提供了 teamName，必须非空
    if (settingsDto.teamName !== undefined) {
      const trimmedName = settingsDto.teamName.trim();
      if (!trimmedName) {
        throw new BadRequestException('团队名称不能为空');
      }
      team.name = trimmedName;
    }
    if (settingsDto.description !== undefined) {
      team.description = settingsDto.description || null;
    }
    if (settingsDto.region !== undefined) {
      team.region = settingsDto.region || null;
    }
    if (settingsDto.autoApprove !== undefined) {
      team.auto_approve = settingsDto.autoApprove ? 1 : 0;
    }
    if (settingsDto.notificationEnabled !== undefined) {
      team.notification_enabled = settingsDto.notificationEnabled ? 1 : 0;
    }

    await this.teamsRepository.save(team);

    // 返回更新后的设置
    // 处理可能为 null 的字段，使用默认值
    return {
      teamName: team.name,
      description: team.description || '',
      region: team.region || '',
      autoApprove: team.auto_approve === 1 || team.auto_approve === null,
      notificationEnabled: team.notification_enabled === 1 || team.notification_enabled === null,
    };
  }
}

