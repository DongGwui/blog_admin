'use client';

import { useState } from 'react';
import { Tag } from '@/domain/entities/Tag';
import { Button } from '@/presentation/components/common/Button';
import { Input } from '@/presentation/components/common/Input';
import { useToast } from '@/presentation/components/common/Toast';
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from '@/presentation/hooks/queries/useTagQueries';

interface EditingTag {
  id: number | null;
  name: string;
}

export function TagList() {
  const { showToast } = useToast();
  const { data: tags, isLoading, error } = useTags();
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

  const [editing, setEditing] = useState<EditingTag | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditing({ id: null, name: '' });
  };

  const handleStartEdit = (tag: Tag) => {
    setIsAdding(false);
    setEditing({ id: tag.id, name: tag.name });
  };

  const handleCancel = () => {
    setEditing(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.name.trim()) {
      showToast('이름을 입력해주세요.', 'error');
      return;
    }

    try {
      if (editing.id === null) {
        await createMutation.mutateAsync({ name: editing.name });
        showToast('태그가 생성되었습니다.', 'success');
      } else {
        await updateMutation.mutateAsync({
          id: editing.id,
          data: { name: editing.name },
        });
        showToast('태그가 수정되었습니다.', 'success');
      }
      handleCancel();
    } catch {
      showToast('저장에 실패했습니다.', 'error');
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`"${tag.name}" 태그를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(tag.id);
      showToast('태그가 삭제되었습니다.', 'success');
    } catch {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--error)' }}>태그를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Add Form */}
      <div
        className="rounded-xl p-4"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              label="새 태그"
              value={isAdding && editing ? editing.name : ''}
              onChange={(e) => {
                if (!isAdding) {
                  setIsAdding(true);
                  setEditing({ id: null, name: e.target.value });
                } else if (editing) {
                  setEditing({ ...editing, name: e.target.value });
                }
              }}
              placeholder="태그 이름을 입력하세요"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isAdding) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
          {isAdding && (
            <>
              <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
                취소
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? '추가 중...' : '추가'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tag List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: 'var(--primary)' }}
          />
        </div>
      ) : !tags?.length ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <p style={{ color: 'var(--text-tertiary)' }}>태그가 없습니다.</p>
        </div>
      ) : (
        <div
          className="rounded-xl p-4"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="group relative inline-flex items-center rounded-full px-4 py-2 transition-colors duration-150"
                style={{
                  background: 'var(--surface-elevated)',
                }}
              >
                {editing?.id === tag.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="w-24 px-2 py-1 text-sm rounded focus:outline-none focus:ring-2"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                      }}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSave();
                        } else if (e.key === 'Escape') {
                          handleCancel();
                        }
                      }}
                    />
                    <button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      style={{ color: 'var(--primary)' }}
                      className="hover:opacity-80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{ color: 'var(--text-tertiary)' }}
                      className="hover:opacity-80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {tag.name}
                    </span>
                    <span className="ml-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      ({tag.postCount})
                    </span>
                    <div className="hidden group-hover:flex items-center ml-2 gap-1">
                      <button
                        onClick={() => handleStartEdit(tag)}
                        className="transition-colors duration-150 hover:text-[var(--primary)]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(tag)}
                        disabled={deleteMutation.isPending}
                        className="transition-colors duration-150 hover:text-[var(--error)]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
