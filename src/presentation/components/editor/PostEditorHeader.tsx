'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/presentation/components/common/Button';

interface PostEditorHeaderProps {
  title: string;
  onSaveDraft: () => void;
  onPublish: () => void;
  onSettingsToggle: () => void;
  isSaving: boolean;
  isDirty: boolean;
  isEdit?: boolean;
}

export function PostEditorHeader({
  title,
  onSaveDraft,
  onPublish,
  onSettingsToggle,
  isSaving,
  isDirty,
  isEdit = false,
}: PostEditorHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        '저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?'
      );
      if (!confirmed) return;
    }
    router.back();
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back button and title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="나가기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="hidden sm:inline">나가기</span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            {isDirty && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                수정됨
              </span>
            )}
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            disabled={isSaving}
            aria-label="임시저장"
          >
            {isSaving ? '저장 중...' : '임시저장'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onPublish}
            disabled={isSaving}
            aria-label={isEdit ? '수정' : '발행'}
          >
            {isEdit ? '수정' : '발행'}
          </Button>

          <button
            type="button"
            onClick={onSettingsToggle}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="설정"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
