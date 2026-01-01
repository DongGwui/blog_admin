'use client';

import { AuthGuard } from '@/presentation/components/layout/AuthGuard';
import { Sidebar } from '@/presentation/components/layout/Sidebar';
import { Header } from '@/presentation/components/layout/Header';
import { ErrorBoundary } from '@/presentation/components/common/ErrorBoundary';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen app-bg">
        {/* Background mesh gradient */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: 'var(--gradient-mesh)',
            opacity: 0.5,
          }}
        />

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="ml-64 relative">
          {/* Header */}
          <Header />

          {/* Page Content with Error Boundary */}
          <main className="p-6 relative">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
