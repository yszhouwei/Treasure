import { ApiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export interface Team {
  id: number;
  name: string;
  leader_id: number;
  group_size: number;
  description?: string;
  cover_image?: string;
  region?: string;
  status: number;
  total_members: number;
  active_members: number;
  total_sales: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface TeamOverview {
  team: Team;
  activeGroups: any[];
  upcomingGroups: any[];
}

export class TeamsService {
  // 获取团队列表
  static async getTeams(): Promise<Team[]> {
    return ApiClient.get<Team[]>(API_ENDPOINTS.TEAMS.LIST);
  }

  // 获取我的团队概览（需要认证）
  static async getMyTeamOverview(): Promise<TeamOverview> {
    return ApiClient.get<TeamOverview>(API_ENDPOINTS.TEAMS.MY_OVERVIEW);
  }

  // 获取团队详情
  static async getTeamById(id: number): Promise<Team> {
    return ApiClient.get<Team>(API_ENDPOINTS.TEAMS.GET_BY_ID(id));
  }

  // 获取我的团队概览
  static async getMyTeamOverview(): Promise<TeamOverview> {
    return ApiClient.get<TeamOverview>(API_ENDPOINTS.TEAMS.MY_OVERVIEW);
  }
}

