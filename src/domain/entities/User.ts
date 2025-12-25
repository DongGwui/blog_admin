export type UserRole = 'admin' | 'editor';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthToken {
  accessToken: string;
  expiresAt: Date;
}
