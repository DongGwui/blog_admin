'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/DependencyProvider';
import { CreateCategoryData, UpdateCategoryData } from '@/domain/repositories/ICategoryRepository';

export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};

// 캐시 시간 상수
const STALE_TIME = 5 * 60 * 1000; // 5분
const GC_TIME = 10 * 60 * 1000; // 10분

export function useCategories() {
  const { getCategoriesUseCase } = useDependencies();

  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => getCategoriesUseCase.execute(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCreateCategory() {
  const { createCategoryUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) => createCategoryUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}

export function useUpdateCategory() {
  const { updateCategoryUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryData }) =>
      updateCategoryUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}

export function useDeleteCategory() {
  const { deleteCategoryUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategoryUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}
