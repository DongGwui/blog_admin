'use client';

import { CategoryList } from '@/presentation/components/category/CategoryList';

export default function CategoriesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          카테고리 관리
        </h1>
        <p
          className="mt-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          블로그 글의 카테고리를 관리합니다.
        </p>
      </div>
      <div className="max-w-3xl">
        <CategoryList />
      </div>
    </div>
  );
}
