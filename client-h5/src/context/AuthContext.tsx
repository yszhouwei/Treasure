import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthService } from '../services/auth.service';
import type { User as ApiUser } from '../services/auth.service';
import type { User as UsersServiceUser } from '../services/users.service';

type AuthMode = 'login' | 'register';

export interface AuthUser {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  avatarColor?: string;
  balance?: number;
  points?: number;
  level?: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  showAuth: boolean;
  authMode: AuthMode;
  loading: boolean;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
  login: (payload: { username: string; password: string }) => Promise<void>;
  register: (payload: { username: string; password: string; email?: string; phone?: string; nickname?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'treasure-user';

const randomColor = () => {
  const palette = ['#D4A574', '#3D8361', '#1890FF', '#722ED1', '#13C2C2'];
  return palette[Math.floor(Math.random() * palette.length)];
};

const convertApiUserToAuthUser = (apiUser: ApiUser | UsersServiceUser): AuthUser => {
  return {
    id: apiUser.id,
    name: apiUser.nickname || apiUser.username,
    email: apiUser.email,
    phone: apiUser.phone,
    avatar: apiUser.avatar,
    avatarColor: randomColor(),
    balance: apiUser.balance ?? 0, // 处理可选字段
    points: apiUser.points ?? 0, // 处理可选字段
    level: apiUser.level ?? 1, // 处理可选字段
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);

  // 初始化时检查是否有已登录的用户
  useEffect(() => {
    const checkAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const storedUser = AuthService.getUser();
          if (storedUser) {
            setUser(convertApiUserToAuthUser(storedUser));
          } else {
            // 尝试从服务器获取用户信息
            const profile = await AuthService.getProfile();
            setUser(convertApiUserToAuthUser(profile));
          }
        } catch (error) {
          console.error('Failed to get user profile', error);
          // 认证失败，清除token
          AuthService.logout();
        }
      }
    };
    checkAuth();
  }, []);

  const openAuth = useCallback((mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  }, []);

  const closeAuth = useCallback(() => {
    setShowAuth(false);
  }, []);

  const login = useCallback(async (payload: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await AuthService.login(payload);
      const authUser = convertApiUserToAuthUser(response.user);
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setShowAuth(false);
    } catch (error: any) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: {
    username: string;
    password: string;
    email?: string;
    phone?: string;
    nickname?: string;
  }) => {
    setLoading(true);
    try {
      const response = await AuthService.register(payload);
      const authUser = convertApiUserToAuthUser(response.user);
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setShowAuth(false);
    } catch (error: any) {
      console.error('Register failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setShowAuth(false);
  }, []);

  // 使用 ref 防止重复调用
  const isRefreshingRef = useRef(false);
  
  const refreshUser = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      return;
    }
    
    // 如果正在刷新，直接返回
    if (isRefreshingRef.current) {
      return;
    }
    
    isRefreshingRef.current = true;
    
    try {
      // 使用 UsersService.getProfile() 获取完整的用户数据（包括 avatar）
      // 而不是 AuthService.getProfile()，因为 /auth/profile 可能不返回完整数据
      const { UsersService } = await import('../services/users.service');
      const profile = await UsersService.getProfile();
      const authUser = convertApiUserToAuthUser(profile);
      
      // 只在数据真正变化时才更新状态，避免无限循环
      setUser(prevUser => {
        if (prevUser && 
            prevUser.id === authUser.id && 
            prevUser.avatar === authUser.avatar &&
            prevUser.name === authUser.name &&
            prevUser.email === authUser.email) {
          return prevUser; // 数据没有变化，返回原对象
        }
        return authUser; // 数据有变化，更新
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    } catch (error) {
      console.error('Failed to refresh user', error);
      // 如果 UsersService 失败，回退到 AuthService
      try {
        const profile = await AuthService.getProfile();
        const authUser = convertApiUserToAuthUser(profile);
        setUser(prevUser => {
          if (prevUser && 
              prevUser.id === authUser.id && 
              prevUser.avatar === authUser.avatar &&
              prevUser.name === authUser.name &&
              prevUser.email === authUser.email) {
            return prevUser;
          }
          return authUser;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      } catch (fallbackError) {
        console.error('Fallback to AuthService also failed', fallbackError);
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && AuthService.isAuthenticated()),
      showAuth,
      authMode,
      loading,
      openAuth,
      closeAuth,
      setAuthMode,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, showAuth, authMode, loading, openAuth, closeAuth, setAuthMode, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
