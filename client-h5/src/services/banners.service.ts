import { ApiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export interface Banner {
  id: number;
  title?: string;
  image_url: string;
  link_url?: string;
  link_type?: string;
  sort_order: number;
  status: number;
  start_time?: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
}

export class BannersService {
  // 获取轮播图列表
  static async getBanners(): Promise<Banner[]> {
    return ApiClient.get<Banner[]>(API_ENDPOINTS.BANNERS.LIST);
  }
}

