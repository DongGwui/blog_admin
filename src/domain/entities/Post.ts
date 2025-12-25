export type PostStatus = 'draft' | 'published';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  categoryId: number | null;
  tagIds: number[];
  thumbnail: string | null;
  viewCount: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface CreatePostParams {
  title: string;
  content: string;
  excerpt?: string;
  categoryId?: number;
  tagIds?: number[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.ceil(words / wordsPerMinute);
}

function generateExcerpt(content: string): string {
  if (content.length <= 200) {
    return content;
  }
  return content.slice(0, 200).trim() + '...';
}

export function createPost(params: CreatePostParams): Post {
  const now = new Date();

  return {
    id: 0,
    title: params.title,
    slug: generateSlug(params.title),
    content: params.content,
    excerpt: params.excerpt || generateExcerpt(params.content),
    status: 'draft',
    categoryId: params.categoryId || null,
    tagIds: params.tagIds || [],
    thumbnail: null,
    viewCount: 0,
    readingTime: calculateReadingTime(params.content),
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };
}
