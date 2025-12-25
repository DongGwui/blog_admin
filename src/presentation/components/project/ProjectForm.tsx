'use client';

import { useState, useCallback } from 'react';
import { Project } from '@/domain/entities/Project';
import {
  useCreateProject,
  useUpdateProject,
} from '@/presentation/hooks/useProjectQueries';
import { Button } from '@/presentation/components/common/Button';
import { Input } from '@/presentation/components/common/Input';

interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [content, setContent] = useState(project?.content || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnailUrl || '');
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || '');
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl || '');
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(project?.techStack || []);
  const [isVisible, setIsVisible] = useState(project?.isVisible ?? true);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!project;
  const isPending = createProject.isPending || updateProject.isPending;

  const handleAddTech = useCallback(() => {
    const tech = techStackInput.trim();
    if (tech && !techStack.includes(tech)) {
      setTechStack((prev) => [...prev, tech]);
      setTechStackInput('');
    }
  }, [techStackInput, techStack]);

  const handleRemoveTech = useCallback((tech: string) => {
    setTechStack((prev) => prev.filter((t) => t !== tech));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTech();
      }
    },
    [handleAddTech]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!description.trim()) {
      setError('설명을 입력해주세요.');
      return;
    }

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        thumbnailUrl: thumbnailUrl.trim() || null,
        githubUrl: githubUrl.trim() || null,
        demoUrl: demoUrl.trim() || null,
        techStack,
        isVisible,
      };

      if (isEditing) {
        await updateProject.mutateAsync({ id: project.id, data });
      } else {
        await createProject.mutateAsync(data);
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-6">
        {isEditing ? '프로젝트 수정' : '새 프로젝트'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목 *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="프로젝트 제목"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명 *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="프로젝트에 대한 간단한 설명"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상세 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="프로젝트 상세 내용 (Markdown 지원)"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            기술 스택
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="기술 입력 후 Enter"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={handleAddTech}>
              추가
            </Button>
          </div>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-blue-900"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              썸네일 URL
            </label>
            <Input
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL
            </label>
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Demo URL
            </label>
            <Input
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isVisible"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="isVisible" className="text-sm text-gray-700">
            공개
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? '저장 중...' : isEditing ? '수정' : '생성'}
        </Button>
      </div>
    </form>
  );
}
