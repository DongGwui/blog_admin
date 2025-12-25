'use client';

import Link from 'next/link';
import { usePosts } from '@/presentation/hooks/queries/usePostQueries';
import { PostStatusBadge } from '@/presentation/components/post/PostStatusBadge';

export function RecentPosts() {
  const { data, isLoading, error } = usePosts({ limit: 5 });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">최근 글</h3>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <p className="text-red-600">글을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  const posts = data?.posts || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">최근 글</h3>
        <Link href="/posts" className="text-sm text-blue-600 hover:text-blue-800">
          전체 보기
        </Link>
      </div>

      {posts.length > 0 ? (
        <ul className="divide-y">
          {posts.map((post) => (
            <li key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
              <Link href={`/posts/${post.id}/edit`} className="block">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <PostStatusBadge status={post.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <p>아직 작성된 글이 없습니다.</p>
          <Link href="/posts/new" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            첫 글 작성하기
          </Link>
        </div>
      )}
    </div>
  );
}
