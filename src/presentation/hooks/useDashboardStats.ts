'use client';

import { usePosts } from './queries/usePostQueries';
import { useCategories } from './queries/useCategoryQueries';
import { useTags } from './queries/useTagQueries';
import { useProjects } from './useProjectQueries';
import { useMediaList } from './useMediaQueries';

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalTags: number;
  totalProjects: number;
  totalMedia: number;
  isLoading: boolean;
}

export function useDashboardStats(): DashboardStats {
  const posts = usePosts();
  const categories = useCategories();
  const tags = useTags();
  const projects = useProjects();
  const media = useMediaList();

  const isLoading =
    posts.isLoading ||
    categories.isLoading ||
    tags.isLoading ||
    projects.isLoading ||
    media.isLoading;

  const postsList = posts.data?.posts || [];
  const publishedPosts = postsList.filter((p) => p.status === 'published').length;
  const draftPosts = postsList.filter((p) => p.status === 'draft').length;

  return {
    totalPosts: posts.data?.total || 0,
    publishedPosts,
    draftPosts,
    totalCategories: categories.data?.length || 0,
    totalTags: tags.data?.length || 0,
    totalProjects: projects.data?.length || 0,
    totalMedia: media.data?.total || 0,
    isLoading,
  };
}
