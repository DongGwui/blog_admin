import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_DAYS = 1;

export class TokenStorage {
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return Cookies.get(TOKEN_KEY) || null;
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    Cookies.set(TOKEN_KEY, token, {
      expires: TOKEN_EXPIRY_DAYS,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  removeToken(): void {
    if (typeof window === 'undefined') {
      return;
    }
    Cookies.remove(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Singleton instance for convenience
export const tokenStorage = new TokenStorage();
