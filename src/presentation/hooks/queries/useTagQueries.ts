'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/DependencyProvider';
import { CreateTagData, UpdateTagData } from '@/domain/repositories/ITagRepository';

export const tagKeys = {
  all: ['tags'] as const,
  list: () => [...tagKeys.all, 'list'] as const,
};

// 캐시 시간 상수
const STALE_TIME = 5 * 60 * 1000; // 5분
const GC_TIME = 10 * 60 * 1000; // 10분

export function useTags() {
  const { getTagsUseCase } = useDependencies();

  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => getTagsUseCase.execute(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCreateTag() {
  const { createTagUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagData) => createTagUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.list() });
    },
  });
}

export function useUpdateTag() {
  const { updateTagUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTagData }) =>
      updateTagUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.list() });
    },
  });
}

export function useDeleteTag() {
  const { deleteTagUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTagUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.list() });
    },
  });
}
