'use client';

import { ReactNode } from 'react';
import { AuthGuard } from '@/presentation/components/layout/AuthGuard';
import { ErrorBoundary } from '@/presentation/components/common/ErrorBoundary';

interface PostEditorLayoutProps {
  children: ReactNode;
}

export function PostEditorLayout({ children }: PostEditorLayoutProps) {
  return (
    <AuthGuard>
      <div
        className="min-h-screen transition-colors duration-200"
        style={{ background: 'var(--background)' }}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </AuthGuard>
  );
}
