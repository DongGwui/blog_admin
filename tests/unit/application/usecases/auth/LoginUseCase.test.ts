import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { AuthToken } from '@/domain/entities/User';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockAuthRepository: IAuthRepository;

  const mockToken: AuthToken = {
    accessToken: 'mock-jwt-token',
    expiresAt: new Date('2024-12-31'),
  };

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
      refreshToken: vi.fn(),
    };
    useCase = new LoginUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should login successfully with valid credentials', async () => {
      vi.mocked(mockAuthRepository.login).mockResolvedValue(mockToken);

      const result = await useCase.execute({
        username: 'admin',
        password: 'password123',
      });

      expect(mockAuthRepository.login).toHaveBeenCalledWith({
        username: 'admin',
        password: 'password123',
      });
      expect(result.accessToken).toBe('mock-jwt-token');
    });

    it('should throw error if username is empty', async () => {
      await expect(
        useCase.execute({
          username: '',
          password: 'password123',
        })
      ).rejects.toThrow('Username is required');

      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it('should throw error if password is empty', async () => {
      await expect(
        useCase.execute({
          username: 'admin',
          password: '',
        })
      ).rejects.toThrow('Password is required');

      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it('should throw error if username is only whitespace', async () => {
      await expect(
        useCase.execute({
          username: '   ',
          password: 'password123',
        })
      ).rejects.toThrow('Username is required');
    });

    it('should propagate repository errors', async () => {
      vi.mocked(mockAuthRepository.login).mockRejectedValue(
        new Error('Invalid credentials')
      );

      await expect(
        useCase.execute({
          username: 'admin',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
