import { ApiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export interface UpdateUserDto {
  nickname?: string;
  email?: string;
  phone?: string;
  bio?: string;
  gender?: string;
  avatar?: string;
}

export interface User {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  bio?: string;
  gender?: number | string; // 后端返回数字，前端可能使用字符串
  avatar?: string;
  balance?: number;
  points?: number;
  level?: number;
}

export class UsersService {
  // 更新用户信息
  static async updateProfile(data: UpdateUserDto): Promise<User> {
    return ApiClient.put<User>(API_ENDPOINTS.USERS.UPDATE, data);
  }

  // 获取用户信息
  static async getProfile(): Promise<User> {
    return ApiClient.get<User>(API_ENDPOINTS.USERS.PROFILE);
  }

  // 上传头像
  static async uploadAvatar(file: File): Promise<{ url: string }> {
    return ApiClient.uploadFile<{ url: string }>(API_ENDPOINTS.USERS.UPLOAD_AVATAR, file, 'avatar');
  }
}

