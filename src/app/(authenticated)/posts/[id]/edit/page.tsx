'use client';

import { use } from 'react';
import Link from 'next/link';
import { PostForm } from '@/presentation/components/post/PostForm';
import { usePost } from '@/presentation/hooks/queries/usePostQueries';
import { Button } from '@/presentation/components/common/Button';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const resolvedParams = use(params);
  const postId = parseInt(resolvedParams.id, 10);
  const { data: post, isLoading, error } = usePost(postId);

  // TODO: Implement image upload functionality with media API
  const handleImageUpload = async (file: File): Promise<string> => {
    // Placeholder - will be implemented when media API is integrated
    console.log('Image upload requested:', file.name);
    return URL.createObjectURL(file);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">글을 찾을 수 없습니다</h1>
          <p className="text-gray-500 mb-4">요청하신 글이 존재하지 않거나 삭제되었습니다.</p>
          <Link href="/posts">
            <Button>목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/posts" className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">글 수정</h1>
          <p className="text-gray-500 mt-1">#{post.id} - {post.title}</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
          <PostForm post={post} onImageUpload={handleImageUpload} />
        </div>
      </div>
    </div>
  );
}
