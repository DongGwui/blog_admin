'use client';

import { ProjectList } from '@/presentation/components/project/ProjectList';

export default function ProjectsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">프로젝트 관리</h1>
        <p className="text-gray-500 mt-1">포트폴리오 프로젝트를 관리합니다.</p>
      </div>
      <div className="max-w-4xl">
        <ProjectList />
      </div>
    </div>
  );
}
