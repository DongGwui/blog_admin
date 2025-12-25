'use client';

import { use } from 'react';
import Link from 'next/link';
import { PostEditorPage } from '@/presentation/components/editor';
import { usePost } from '@/presentation/hooks/queries/usePostQueries';
import { useCategories } from '@/presentation/hooks/queries/useCategoryQueries';
import { useTags } from '@/presentation/hooks/queries/useTagQueries';
import { Button } from '@/presentation/components/common/Button';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const resolvedParams = use(params);
  const postId = parseInt(resolvedParams.id, 10);
  const { data: post, isLoading, error } = usePost(postId);
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  // TODO: Implement image upload functionality with media API
  const handleImageUpload = async (file: File): Promise<string> => {
    // Placeholder - will be implemented when media API is integrated
    console.log('Image upload requested:', file.name);
    return URL.createObjectURL(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            글을 찾을 수 없습니다
          </h1>
          <p className="text-gray-500 mb-4">
            요청하신 글이 존재하지 않거나 삭제되었습니다.
          </p>
          <Link href="/posts">
            <Button>목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PostEditorPage
      post={post}
      categories={categories}
      tags={tags}
      onImageUpload={handleImageUpload}
    />
  );
}
