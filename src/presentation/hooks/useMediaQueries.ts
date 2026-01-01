'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '../providers/DependencyProvider';
import { GetMediaParams } from '@/domain/repositories/IMediaRepository';

const MEDIA_QUERY_KEY = 'media';

// 캐시 시간 상수
const STALE_TIME = 5 * 60 * 1000; // 5분
const GC_TIME = 10 * 60 * 1000; // 10분

export function useMediaList(params?: GetMediaParams) {
  const { getMediaListUseCase } = useDependencies();

  return useQuery({
    queryKey: [MEDIA_QUERY_KEY, params],
    queryFn: () => getMediaListUseCase.execute(params),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
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
