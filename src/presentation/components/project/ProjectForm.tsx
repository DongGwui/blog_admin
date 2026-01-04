'use client';

import { useState, useCallback, useEffect } from 'react';
import { Project } from '@/domain/entities/Project';
import {
  useCreateProject,
  useUpdateProject,
  useProject,
} from '@/presentation/hooks/useProjectQueries';
import { useUploadMedia } from '@/presentation/hooks/useMediaQueries';
import { Button } from '@/presentation/components/common/Button';
import { Input } from '@/presentation/components/common/Input';
import { MarkdownEditor } from '@/presentation/components/editor/MarkdownEditor';

interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const uploadMedia = useUploadMedia();

  // 수정 모드일 때 상세 데이터 조회
  const { data: projectDetail, isLoading: isLoadingDetail } = useProject(project?.id || 0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isEditing = !!project;
  const isPending = createProject.isPending || updateProject.isPending;

  // 상세 데이터가 로드되면 폼 초기화
  useEffect(() => {
    if (isEditing && projectDetail && !isInitialized) {
      setTitle(projectDetail.title || '');
      setDescription(projectDetail.description || '');
      setContent(projectDetail.content || '');
      setThumbnailUrl(projectDetail.thumbnailUrl || '');
      setGithubUrl(projectDetail.githubUrl || '');
      setDemoUrl(projectDetail.demoUrl || '');
      setTechStack(projectDetail.techStack || []);
      setIsVisible(projectDetail.isVisible ?? true);
      setIsInitialized(true);
    }
  }, [isEditing, projectDetail, isInitialized]);

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

  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      const result = await uploadMedia.mutateAsync(file);
      return result.url;
    },
    [uploadMedia]
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

  // 수정 모드에서 데이터 로딩 중
  if (isEditing && isLoadingDetail) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">프로젝트 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold mb-6 dark:text-white">
        {isEditing ? '프로젝트 수정' : '새 프로젝트'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            상세 내용
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="프로젝트 상세 내용을 마크다운으로 작성하세요..."
            height={300}
            onImageUpload={handleImageUpload}
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
            <button
              type="button"
              onClick={handleAddTech}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              aria-label="기술 스택 추가"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
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
