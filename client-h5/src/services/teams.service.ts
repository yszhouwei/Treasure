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

// 使用类型别名而不是接口，确保 Vite 能正确识别导出
export type TeamSettings = {
  teamName: string;
  description: string;
  region: string;
  autoApprove: boolean;
  notificationEnabled: boolean;
};

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

  // 获取团队设置
  static async getTeamSettings(): Promise<TeamSettings> {
    return ApiClient.get<TeamSettings>(API_ENDPOINTS.TEAMS.GET_SETTINGS);
  }

  // 更新团队设置
  static async updateTeamSettings(settings: Partial<TeamSettings>): Promise<TeamSettings> {
    console.log('调用 updateTeamSettings，端点:', API_ENDPOINTS.TEAMS.UPDATE_SETTINGS);
    console.log('发送的数据:', settings);
    try {
      const result = await ApiClient.put<TeamSettings>(API_ENDPOINTS.TEAMS.UPDATE_SETTINGS, settings);
      console.log('API 调用成功，返回:', result);
      return result;
    } catch (error) {
      console.error('API 调用失败:', error);
      throw error;
    }
  }
}

