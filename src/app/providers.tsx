'use client';

import { ReactNode } from 'react';
import { DependencyProvider } from '@/presentation/providers/DependencyProvider';
import { AuthProvider } from '@/presentation/context/AuthContext';
import { ThemeProvider } from '@/presentation/context/ThemeContext';
import { ToastProvider } from '@/presentation/components/common/Toast';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system">
      <DependencyProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </DependencyProvider>
    </ThemeProvider>
  );
}
