import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { User } from '@/domain/entities/User';

describe('GetCurrentUserUseCase', () => {
  let useCase: GetCurrentUserUseCase;
  let mockAuthRepository: IAuthRepository;

  const mockUser: User = {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
  };

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
      refreshToken: vi.fn(),
    };
    useCase = new GetCurrentUserUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should return current user when authenticated', async () => {
      vi.mocked(mockAuthRepository.getCurrentUser).mockResolvedValue(mockUser);

      const result = await useCase.execute();

      expect(result).toEqual(mockUser);
      expect(mockAuthRepository.getCurrentUser).toHaveBeenCalled();
    });

    it('should return null when not authenticated', async () => {
      vi.mocked(mockAuthRepository.getCurrentUser).mockResolvedValue(null);

      const result = await useCase.execute();

      expect(result).toBeNull();
    });

    it('should propagate repository errors', async () => {
      vi.mocked(mockAuthRepository.getCurrentUser).mockRejectedValue(
        new Error('Network error')
      );

      await expect(useCase.execute()).rejects.toThrow('Network error');
    });
  });
});
