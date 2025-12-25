import { IAuthRepository, LoginCredentials } from '@/domain/repositories/IAuthRepository';
import { User, AuthToken } from '@/domain/entities/User';
import { ApiClient } from '../api/ApiClient';
import { TokenStorage } from '../auth/TokenStorage';

interface ApiLoginResponse {
  token: string;
  expires_at: string;
}

interface ApiUserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

export class ApiAuthRepository implements IAuthRepository {
  constructor(
    private api: ApiClient,
    private tokenStorage: TokenStorage
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const response = await this.api.post<ApiLoginResponse>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
    });

    this.tokenStorage.setToken(response.token);

    return {
      accessToken: response.token,
      expiresAt: new Date(response.expires_at),
    };
  }

  async logout(): Promise<void> {
    this.tokenStorage.removeToken();
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.tokenStorage.isAuthenticated()) {
      return null;
    }

    try {
      const response = await this.api.get<ApiUserResponse>('/auth/me');
      return {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role as 'admin' | 'editor',
      };
    } catch {
      return null;
    }
  }

  async refreshToken(): Promise<AuthToken> {
    const response = await this.api.post<ApiLoginResponse>('/auth/refresh');

    this.tokenStorage.setToken(response.token);

    return {
      accessToken: response.token,
      expiresAt: new Date(response.expires_at),
    };
  }
}
