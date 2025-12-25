import { describe, it, expect } from 'vitest';
import { User, AuthToken, UserRole } from '@/domain/entities/User';

describe('User Entity', () => {
  describe('User interface', () => {
    it('should have required properties', () => {
      const user: User = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
      };

      expect(user.id).toBe(1);
      expect(user.username).toBe('admin');
      expect(user.email).toBe('admin@example.com');
      expect(user.role).toBe('admin');
    });

    it('should allow editor role', () => {
      const role: UserRole = 'editor';
      expect(role).toBe('editor');
    });

    it('should allow admin role', () => {
      const role: UserRole = 'admin';
      expect(role).toBe('admin');
    });
  });

  describe('AuthToken interface', () => {
    it('should have required properties', () => {
      const expiresAt = new Date('2024-12-31');
      const token: AuthToken = {
        accessToken: 'jwt-token-here',
        expiresAt,
      };

      expect(token.accessToken).toBe('jwt-token-here');
      expect(token.expiresAt).toEqual(expiresAt);
    });
  });
});
