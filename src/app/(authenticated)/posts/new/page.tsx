'use client';

import Link from 'next/link';
import { PostForm } from '@/presentation/components/post/PostForm';

export default function NewPostPage() {
  // TODO: Implement image upload functionality with media API
  const handleImageUpload = async (file: File): Promise<string> => {
    // Placeholder - will be implemented when media API is integrated
    console.log('Image upload requested:', file.name);
    return URL.createObjectURL(file);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">새 글 작성</h1>
          <p className="text-gray-500 mt-1">새로운 블로그 글을 작성합니다.</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
          <PostForm onImageUpload={handleImageUpload} />
        </div>
      </div>
    </div>
  );
}
