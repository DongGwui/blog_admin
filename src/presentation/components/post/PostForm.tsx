'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post, PostStatus } from '@/domain/entities/Post';
import { CreatePostData, UpdatePostData } from '@/domain/repositories/IPostRepository';
import { Button } from '@/presentation/components/common/Button';
import { Input } from '@/presentation/components/common/Input';
import { MarkdownEditor } from '@/presentation/components/editor/MarkdownEditor';
import { useToast } from '@/presentation/components/common/Toast';
import { useCreatePost, useUpdatePost } from '@/presentation/hooks/queries/usePostQueries';

interface PostFormProps {
  post?: Post;
  categories?: { id: number; name: string }[];
  tags?: { id: number; name: string }[];
  onImageUpload?: (file: File) => Promise<string>;
}

interface FormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categoryId: number | null;
  tagIds: number[];
  thumbnail: string;
  status: PostStatus;
}

export function PostForm({ post, categories = [], tags = [], onImageUpload }: PostFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    categoryId: null,
    tagIds: [],
    thumbnail: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isAutoSlug, setIsAutoSlug] = useState(true);

  // Initialize form with post data
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        categoryId: post.categoryId,
        tagIds: post.tagIds,
        thumbnail: post.thumbnail || '',
        status: post.status,
      });
      setIsAutoSlug(false);
    }
  }, [post]);

  // Auto-generate slug from title
  useEffect(() => {
    if (isAutoSlug && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-가-힣]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, isAutoSlug]);

  const handleInputChange = (field: keyof FormData, value: string | number | null | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSlugChange = (value: string) => {
    setIsAutoSlug(false);
    handleInputChange('slug', value);
  };

  const handleTagToggle = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (saveAsStatus?: PostStatus) => {
    if (!validate()) {
      showToast('입력 내용을 확인해주세요.', 'error');
      return;
    }

    const status = saveAsStatus || formData.status;

    try {
      if (post) {
        // Update existing post
        const updateData: UpdatePostData = {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || undefined,
          categoryId: formData.categoryId,
          tagIds: formData.tagIds,
          thumbnail: formData.thumbnail || null,
          status,
        };

        await updatePostMutation.mutateAsync({ id: post.id, data: updateData });
        showToast('글이 수정되었습니다.', 'success');
      } else {
        // Create new post
        const createData: CreatePostData = {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || undefined,
          categoryId: formData.categoryId,
          tagIds: formData.tagIds,
          thumbnail: formData.thumbnail || null,
          status,
        };

        await createPostMutation.mutateAsync(createData);
        showToast(status === 'published' ? '글이 발행되었습니다.' : '글이 저장되었습니다.', 'success');
      }

      router.push('/posts');
    } catch {
      showToast('저장에 실패했습니다.', 'error');
    }
  };

  const isSubmitting = createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <Input
          label="제목"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="글 제목을 입력하세요"
          error={errors.title}
        />
      </div>

      {/* Slug */}
      <div>
        <Input
          label="슬러그 (URL)"
          value={formData.slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="url-friendly-slug"
          helperText="URL에 사용될 슬러그입니다. 비워두면 자동 생성됩니다."
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
        {errors.content && <p className="text-sm text-red-600 mb-2">{errors.content}</p>}
        <MarkdownEditor
          value={formData.content}
          onChange={(value) => handleInputChange('content', value)}
          onImageUpload={onImageUpload}
          placeholder="마크다운으로 내용을 작성하세요..."
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">요약</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => handleInputChange('excerpt', e.target.value)}
          placeholder="글 요약을 입력하세요. 비워두면 자동 생성됩니다."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Thumbnail */}
      <div>
        <Input
          label="썸네일 URL"
          value={formData.thumbnail}
          onChange={(e) => handleInputChange('thumbnail', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) =>
              handleInputChange('categoryId', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData.tagIds.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
          취소
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '임시 저장'}
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
          >
            {isSubmitting ? '발행 중...' : post?.status === 'published' ? '수정' : '발행'}
          </Button>
        </div>
      </div>
    </div>
  );
}
