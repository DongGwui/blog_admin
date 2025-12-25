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
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="ml-64">
          {/* Header */}
          <Header />

          {/* Page Content with Error Boundary */}
          <main>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
