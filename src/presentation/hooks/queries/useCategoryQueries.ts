'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/DependencyProvider';
import { CreateCategoryData, UpdateCategoryData } from '@/domain/repositories/ICategoryRepository';

export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};

export function useCategories() {
  const { getCategoriesUseCase } = useDependencies();

  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => getCategoriesUseCase.execute(),
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
