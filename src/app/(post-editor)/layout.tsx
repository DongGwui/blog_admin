'use client';

import { PostEditorLayout } from '@/presentation/components/layout/PostEditorLayout';

export default function PostEditorRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PostEditorLayout>{children}</PostEditorLayout>;
}
