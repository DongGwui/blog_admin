'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/context/AuthContext';
import { useToast } from '@/presentation/components/common/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      showToast('Login successful!', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="relative">
          {/* Animated loading spinner with gradient */}
          <div className="w-16 h-16 rounded-full border-4 border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin"
               style={{
                 background: 'linear-gradient(var(--background), var(--background)) padding-box, linear-gradient(135deg, #6366f1, #a855f7, #ec4899) border-box',
                 borderRadius: '50%'
               }} />
          <div className="absolute inset-2 rounded-full bg-[var(--background)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-[var(--background)]">
        {/* Base gradient layer */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #581c87 75%, #831843 100%)',
          }}
        />

        {/* Animated mesh gradient */}
        <div
          className="absolute inset-0 animate-gradient opacity-60"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 90% 90%, rgba(6, 182, 212, 0.3) 0%, transparent 40%)
            `,
            backgroundSize: '200% 200%',
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in-down">
          {/* Animated Logo Icon */}
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse-glow" />

              {/* Icon container */}
              <div
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title with gradient */}
          <h1
            className="text-4xl font-bold tracking-tight mb-2"
            style={{
              background: 'linear-gradient(135deg, #c7d2fe 0%, #e9d5ff 50%, #fce7f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Blog Admin
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Sign in to manage your content
          </p>
        </div>

        {/* Login Form Card */}
        <div
          className="relative animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          {/* Card glow effect */}
          <div
            className="absolute -inset-1 rounded-3xl opacity-50 blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))',
            }}
          />

          {/* Card */}
          <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl p-8 space-y-6"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Error Message */}
            {error && (
              <div
                className="p-4 rounded-xl text-sm animate-scale-in"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Username Field */}
            <div
              className="space-y-2 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Username
              </label>
              <div className="relative group">
                {/* Gradient border on focus */}
                <div
                  className={`absolute -inset-0.5 rounded-xl transition-opacity duration-300 ${
                    focusedField === 'username' ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                  }}
                />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === 'username' ? 'text-purple-400' : 'text-gray-500'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 transition-all duration-200 outline-none disabled:opacity-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div
              className="space-y-2 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative group">
                {/* Gradient border on focus */}
                <div
                  className={`absolute -inset-0.5 rounded-xl transition-opacity duration-300 ${
                    focusedField === 'password' ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                  }}
                />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === 'password' ? 'text-purple-400' : 'text-gray-500'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 transition-all duration-200 outline-none disabled:opacity-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div
              className="pt-2 animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              <button
                type="submit"
                disabled={!username || !password || isLoading}
                className="relative w-full group overflow-hidden rounded-xl py-4 font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Button background gradient */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                  }}
                />

                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
                    boxShadow: '0 0 40px rgba(168, 85, 247, 0.5)',
                  }}
                />

                {/* Shine effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 group-disabled:opacity-0 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)',
                    transform: 'translateX(-100%)',
                    animation: 'none',
                  }}
                />

                {/* Button content */}
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer text */}
        <p
          className="text-center text-sm text-[var(--text-tertiary)] mt-8 animate-fade-in"
          style={{ animationDelay: '500ms' }}
        >
          Access restricted to authorized administrators
        </p>
      </div>

      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </div>
  );
}
