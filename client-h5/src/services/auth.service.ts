import { ApiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export interface RegisterDto {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  nickname?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  balance: number;
  points: number;
  level: number;
  is_team_leader?: number;
  team_id?: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export class AuthService {
  // 用户注册
  static async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    // 保存token
    if (response.access_token) {
      localStorage.setItem('treasure-token', response.access_token);
      localStorage.setItem('treasure-user', JSON.stringify(response.user));
    }
    return response;
  }

  // 用户登录
  static async login(data: LoginDto): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    // 保存token
    if (response.access_token) {
      localStorage.setItem('treasure-token', response.access_token);
      localStorage.setItem('treasure-user', JSON.stringify(response.user));
    }
    return response;
  }

  // 获取当前用户信息
  static async getProfile(): Promise<User> {
    return ApiClient.post<User>(API_ENDPOINTS.AUTH.PROFILE);
  }

  // 登出
  static logout(): void {
    localStorage.removeItem('treasure-token');
    localStorage.removeItem('treasure-user');
  }

  // 获取存储的token
  static getToken(): string | null {
    return localStorage.getItem('treasure-token');
  }

  // 获取存储的用户信息
  static getUser(): User | null {
    const userStr = localStorage.getItem('treasure-user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // 检查是否已登录
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

