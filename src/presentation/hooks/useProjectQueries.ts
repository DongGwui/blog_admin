'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '../providers/DependencyProvider';
import { CreateProjectData, UpdateProjectData } from '@/domain/repositories/IProjectRepository';

const PROJECT_QUERY_KEY = 'projects';

export function useProjects() {
  const { getProjectsUseCase } = useDependencies();

  return useQuery({
    queryKey: [PROJECT_QUERY_KEY],
    queryFn: () => getProjectsUseCase.execute(),
  });
}

export function useProject(id: number) {
  const { getProjectByIdUseCase } = useDependencies();

  return useQuery({
    queryKey: [PROJECT_QUERY_KEY, id],
    queryFn: () => getProjectByIdUseCase.execute(id),
    enabled: id > 0,
  });
}

export function useCreateProject() {
  const { createProjectUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => createProjectUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEY] });
    },
  });
}

export function useUpdateProject() {
  const { updateProjectUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectData }) =>
      updateProjectUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEY] });
    },
  });
}

export function useDeleteProject() {
  const { deleteProjectUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProjectUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEY] });
    },
  });
}

export function useReorderProjects() {
  const { reorderProjectsUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orders: { id: number; sortOrder: number }[]) =>
      reorderProjectsUseCase.execute(orders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEY] });
    },
  });
}
