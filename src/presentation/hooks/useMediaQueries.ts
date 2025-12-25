'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '../providers/DependencyProvider';
import { GetMediaParams } from '@/domain/repositories/IMediaRepository';

const MEDIA_QUERY_KEY = 'media';

export function useMediaList(params?: GetMediaParams) {
  const { getMediaListUseCase } = useDependencies();

  return useQuery({
    queryKey: [MEDIA_QUERY_KEY, params],
    queryFn: () => getMediaListUseCase.execute(params),
  });
}

export function useUploadMedia() {
  const { uploadMediaUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadMediaUseCase.execute(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDIA_QUERY_KEY] });
    },
  });
}

export function useDeleteMedia() {
  const { deleteMediaUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMediaUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDIA_QUERY_KEY] });
    },
  });
}
