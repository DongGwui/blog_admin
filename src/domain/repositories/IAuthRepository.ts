import { User, AuthToken } from '../entities/User';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthToken>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<AuthToken>;
}
