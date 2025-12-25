'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/DependencyProvider';
import { GetPostsParams, CreatePostData, UpdatePostData } from '@/domain/repositories/IPostRepository';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params?: GetPostsParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

// Get posts list
export function usePosts(params?: GetPostsParams) {
  const { getPostsUseCase } = useDependencies();

  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => getPostsUseCase.execute(params),
  });
}

// Get single post by ID
export function usePost(id: number) {
  const { getPostByIdUseCase } = useDependencies();

  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostByIdUseCase.execute(id),
    enabled: id > 0,
  });
}

// Create post mutation
export function useCreatePost() {
  const { createPostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => createPostUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// Update post mutation
export function useUpdatePost() {
  const { updatePostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostData }) =>
      updatePostUseCase.execute(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
    },
  });
}

// Delete post mutation
export function useDeletePost() {
  const { deletePostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePostUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// Publish/unpublish post mutation
export function usePublishPost() {
  const { publishPostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, publish }: { id: number; publish: boolean }) =>
      publishPostUseCase.execute(id, publish),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
    },
  });
}
