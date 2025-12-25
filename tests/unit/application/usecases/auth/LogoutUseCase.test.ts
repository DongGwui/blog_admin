import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogoutUseCase } from '@/application/usecases/auth/LogoutUseCase';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let mockAuthRepository: IAuthRepository;

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
      refreshToken: vi.fn(),
    };
    useCase = new LogoutUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should call logout on repository', async () => {
      vi.mocked(mockAuthRepository.logout).mockResolvedValue(undefined);

      await useCase.execute();

      expect(mockAuthRepository.logout).toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      vi.mocked(mockAuthRepository.logout).mockRejectedValue(
        new Error('Logout failed')
      );

      await expect(useCase.execute()).rejects.toThrow('Logout failed');
    });
  });
});
