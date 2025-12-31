import { IAuthRepository, LoginCredentials } from '@/domain/repositories/IAuthRepository';
import { User, AuthToken } from '@/domain/entities/User';
import { ApiClient } from '../api/ApiClient';
import { TokenStorage } from '../auth/TokenStorage';

interface ApiLoginResponse {
  data: {
    token: string;
    expires_at: string;
  };
}

interface ApiUserResponse {
  data: {
    id: number;
    username: string;
    created_at: string;
  };
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

    const { token, expires_at } = response.data;
    this.tokenStorage.setToken(token);

    return {
      accessToken: token,
      expiresAt: new Date(expires_at),
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
        id: response.data.id,
        username: response.data.username,
        email: '',
        role: 'admin',
      };
    } catch {
      return null;
    }
  }

  async refreshToken(): Promise<AuthToken> {
    const response = await this.api.post<ApiLoginResponse>('/auth/refresh');

    const { token, expires_at } = response.data;
    this.tokenStorage.setToken(token);

    return {
      accessToken: token,
      expiresAt: new Date(expires_at),
    };
  }
}
