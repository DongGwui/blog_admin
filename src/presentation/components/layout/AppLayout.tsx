'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  return (
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
        <Header title={title} />

        {/* Page Content */}
        <main className="p-6 relative app-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
