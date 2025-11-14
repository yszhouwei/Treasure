import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../entities/team.entity';
import { GroupBuying } from '../../entities/group-buying.entity';

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
}

