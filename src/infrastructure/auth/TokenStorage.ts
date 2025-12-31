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
    // HTTPS 환경에서만 secure 쿠키 사용
    // 내부망 HTTP 환경에서는 NEXT_PUBLIC_COOKIE_SECURE=false 설정
    const isSecure = process.env.NEXT_PUBLIC_COOKIE_SECURE !== 'false'
      && process.env.NODE_ENV === 'production'
      && typeof window !== 'undefined'
      && window.location.protocol === 'https:';

    Cookies.set(TOKEN_KEY, token, {
      expires: TOKEN_EXPIRY_DAYS,
      sameSite: isSecure ? 'strict' : 'lax',
      secure: isSecure,
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
