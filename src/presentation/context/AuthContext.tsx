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
      const currentUser = await getCurrentUserUseCase.execute();
      setUser(currentUser);
    } catch {
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
      await refreshUser();
    },
    [loginUseCase, refreshUser]
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
