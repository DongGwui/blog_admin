import { IAuthRepository, LoginCredentials } from '@/domain/repositories/IAuthRepository';
import { AuthToken } from '@/domain/entities/User';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthToken> {
    if (!credentials.username || !credentials.username.trim()) {
      throw new Error('Username is required');
    }

    if (!credentials.password || !credentials.password.trim()) {
      throw new Error('Password is required');
    }

    return this.authRepository.login(credentials);
  }
}
