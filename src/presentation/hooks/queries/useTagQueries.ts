'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/DependencyProvider';
import { CreateTagData, UpdateTagData } from '@/domain/repositories/ITagRepository';

export const tagKeys = {
  all: ['tags'] as const,
  list: () => [...tagKeys.all, 'list'] as const,
};

export function useTags() {
  const { getTagsUseCase } = useDependencies();

  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => getTagsUseCase.execute(),
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
