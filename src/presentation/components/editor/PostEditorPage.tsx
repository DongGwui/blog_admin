'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Post, PostStatus } from '@/domain/entities/Post';
import { CreatePostData, UpdatePostData } from '@/domain/repositories/IPostRepository';
import { useToast } from '@/presentation/components/common/Toast';
import { useCreatePost, useUpdatePost } from '@/presentation/hooks/queries/usePostQueries';
import { usePostEditorLayout } from '@/presentation/hooks/usePostEditorLayout';
import { PostEditorHeader } from './PostEditorHeader';
import { PostContentEditor } from './PostContentEditor';
import { PostSettingsPanel } from './PostSettingsPanel';

interface PostEditorPageProps {
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

export function PostEditorPage({
  post,
  categories = [],
  tags = [],
  onImageUpload,
}: PostEditorPageProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const {
    isSettingsPanelOpen,
    toggleSettingsPanel,
    closeSettingsPanel,
  } = usePostEditorLayout();

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

  const [isDirty, setIsDirty] = useState(false);
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

  const handleTitleChange = useCallback((title: string) => {
    setFormData((prev) => ({ ...prev, title }));
    setIsDirty(true);
  }, []);

  const handleContentChange = useCallback((content: string) => {
    setFormData((prev) => ({ ...prev, content }));
    setIsDirty(true);
  }, []);

  const handleThumbnailChange = useCallback((thumbnail: string) => {
    setFormData((prev) => ({ ...prev, thumbnail }));
    setIsDirty(true);
  }, []);

  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setFormData((prev) => ({ ...prev, categoryId }));
    setIsDirty(true);
  }, []);

  const handleTagToggle = useCallback((tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
    setIsDirty(true);
  }, []);

  const handleSlugChange = useCallback((slug: string) => {
    setIsAutoSlug(false);
    setFormData((prev) => ({ ...prev, slug }));
    setIsDirty(true);
  }, []);

  const handleExcerptChange = useCallback((excerpt: string) => {
    setFormData((prev) => ({ ...prev, excerpt }));
    setIsDirty(true);
  }, []);

  const validate = (): boolean => {
    if (!formData.title.trim()) {
      showToast('제목을 입력해주세요.', 'error');
      return false;
    }
    if (!formData.content.trim()) {
      showToast('내용을 입력해주세요.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (saveAsStatus: PostStatus) => {
    if (!validate()) return;

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
          status: saveAsStatus,
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
          status: saveAsStatus,
        };

        await createPostMutation.mutateAsync(createData);
        showToast(
          saveAsStatus === 'published' ? '글이 발행되었습니다.' : '글이 저장되었습니다.',
          'success'
        );
      }

      setIsDirty(false);
      router.push('/posts');
    } catch {
      showToast('저장에 실패했습니다.', 'error');
    }
  };

  const handleSaveDraft = useCallback(() => handleSubmit('draft'), [handleSubmit]);
  const handlePublish = useCallback(() => handleSubmit('published'), [handleSubmit]);

  const isSaving = createPostMutation.isPending || updatePostMutation.isPending;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: Save draft
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSaving) handleSaveDraft();
      }
      // Ctrl/Cmd + Enter: Publish
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isSaving) handlePublish();
      }
      // Escape: Close settings panel
      if (e.key === 'Escape' && isSettingsPanelOpen) {
        e.preventDefault();
        closeSettingsPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveDraft, handlePublish, isSaving, isSettingsPanelOpen, closeSettingsPanel]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <PostEditorHeader
        title={post ? '글 수정' : '새 글 작성'}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onSettingsToggle={toggleSettingsPanel}
        isSaving={isSaving}
        isDirty={isDirty}
        isEdit={!!post}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <PostContentEditor
          title={formData.title}
          content={formData.content}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onImageUpload={onImageUpload}
        />
      </main>

      {/* Settings Panel */}
      <PostSettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={closeSettingsPanel}
        thumbnail={formData.thumbnail}
        onThumbnailChange={handleThumbnailChange}
        categoryId={formData.categoryId}
        onCategoryChange={handleCategoryChange}
        tagIds={formData.tagIds}
        onTagToggle={handleTagToggle}
        slug={formData.slug}
        onSlugChange={handleSlugChange}
        excerpt={formData.excerpt}
        onExcerptChange={handleExcerptChange}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
