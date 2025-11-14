import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthMode = 'login' | 'register';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  showAuth: boolean;
  authMode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
  login: (payload: { email: string; name?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'treasure-user';

const deriveNameFromEmail = (email: string) => {
  if (!email) return 'Explorer';
  const localPart = email.split('@')[0];
  if (!localPart) return 'Explorer';
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
};

const randomColor = () => {
  const palette = ['#D4A574', '#3D8361', '#1890FF', '#722ED1', '#13C2C2'];
  return palette[Math.floor(Math.random() * palette.length)];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser;
        setUser(parsed);
      } catch (error) {
        console.warn('Failed to parse stored user', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const openAuth = useCallback((mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  }, []);

  const closeAuth = useCallback(() => {
    setShowAuth(false);
  }, []);

  const login = useCallback((payload: { email: string; name?: string }) => {
    const email = payload.email.trim().toLowerCase();
    const name = payload.name?.trim() || deriveNameFromEmail(email);
    const nextUser: AuthUser = {
      id: email,
      email,
      name,
      avatarColor: randomColor()
    };
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setShowAuth(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setShowAuth(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      showAuth,
      authMode,
      openAuth,
      closeAuth,
      setAuthMode,
      login,
      logout
    }),
    [user, showAuth, authMode, openAuth, closeAuth, setAuthMode, login, logout]
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
