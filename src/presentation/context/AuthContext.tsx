'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { User } from '@/domain/entities/User';
import { useDependencies } from '@/presentation/providers/DependencyProvider';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { loginUseCase, logoutUseCase, getCurrentUserUseCase, tokenStorage } =
    useDependencies();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      console.log('[Auth] Fetching current user...');
      const currentUser = await getCurrentUserUseCase.execute();
      console.log('[Auth] Current user fetched:', currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error('[Auth] Failed to fetch user:', error);
      setUser(null);
    }
  }, [getCurrentUserUseCase]);

  useEffect(() => {
    const initAuth = async () => {
      if (tokenStorage.isAuthenticated()) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    initAuth();
  }, [tokenStorage, refreshUser]);

  const login = useCallback(
    async (username: string, password: string) => {
      await loginUseCase.execute({ username, password });
      const currentUser = await getCurrentUserUseCase.execute();
      if (!currentUser) {
        throw new Error('유저 정보를 가져올 수 없습니다');
      }
      setUser(currentUser);
    },
    [loginUseCase, getCurrentUserUseCase]
  );

  const logout = useCallback(async () => {
    await logoutUseCase.execute();
    setUser(null);
  }, [logoutUseCase]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
