'use client';

import { useState } from 'react';
import { Category } from '@/domain/entities/Category';
import { Button } from '@/presentation/components/common/Button';
import { Input } from '@/presentation/components/common/Input';
import { useToast } from '@/presentation/components/common/Toast';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/presentation/hooks/queries/useCategoryQueries';

interface EditingCategory {
  id: number | null;
  name: string;
  description: string;
}

export function CategoryList() {
  const { showToast } = useToast();
  const { data: categories, isLoading, error } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [editing, setEditing] = useState<EditingCategory | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditing({ id: null, name: '', description: '' });
  };

  const handleStartEdit = (category: Category) => {
    setIsAdding(false);
    setEditing({
      id: category.id,
      name: category.name,
      description: category.description || '',
    });
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
        await createMutation.mutateAsync({
          name: editing.name,
          description: editing.description || undefined,
        });
        showToast('카테고리가 생성되었습니다.', 'success');
      } else {
        await updateMutation.mutateAsync({
          id: editing.id,
          data: {
            name: editing.name,
            description: editing.description || null,
          },
        });
        showToast('카테고리가 수정되었습니다.', 'success');
      }
      handleCancel();
    } catch {
      showToast('저장에 실패했습니다.', 'error');
    }
  };

  const handleDelete = async (category: Category) => {
    if (category.postCount > 0) {
      showToast(`이 카테고리에 ${category.postCount}개의 글이 있어 삭제할 수 없습니다.`, 'error');
      return;
    }

    if (!confirm(`"${category.name}" 카테고리를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(category.id);
      showToast('카테고리가 삭제되었습니다.', 'success');
    } catch {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--error)' }}>카테고리를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={handleStartAdd} disabled={isAdding}>
          새 카테고리
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && editing && (
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            background: 'var(--primary-light)',
            border: '1px solid var(--primary)',
          }}
        >
          <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
            새 카테고리
          </h3>
          <Input
            label="이름"
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            placeholder="카테고리 이름"
          />
          <Input
            label="설명"
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            placeholder="카테고리 설명 (선택)"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      )}

      {/* Category List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: 'var(--primary)' }}
          />
        </div>
      ) : !categories?.length ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <p style={{ color: 'var(--text-tertiary)' }}>카테고리가 없습니다.</p>
        </div>
      ) : (
        <div
          className="rounded-xl divide-y overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderColor: 'var(--border)',
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-4 transition-colors duration-150 hover:bg-[var(--surface-hover)]"
              style={{ borderColor: 'var(--border)' }}
            >
              {editing?.id === category.id ? (
                <div className="space-y-3">
                  <Input
                    label="이름"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                  <Input
                    label="설명"
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
                      취소
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? '저장 중...' : '저장'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {category.description}
                      </p>
                    )}
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      슬러그: {category.slug} · 글 {category.postCount}개
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(category)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      disabled={deleteMutation.isPending}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
