'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useDependencies } from '../providers/DependencyProvider';
import { GetCommentsParams, MinimizeReason } from '@/domain/repositories/ICommentRepository';

const COMMENT_QUERY_KEY = 'comments';

// 캐시 시간 상수
const STALE_TIME = 2 * 60 * 1000; // 2분 (댓글은 더 자주 갱신)
const GC_TIME = 5 * 60 * 1000; // 5분

/**
 * 댓글 목록 조회 (일반 페이지네이션)
 */
export function useComments(params?: GetCommentsParams) {
  const { getCommentsUseCase } = useDependencies();

  return useQuery({
    queryKey: [COMMENT_QUERY_KEY, params],
    queryFn: () => getCommentsUseCase.execute(params),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

/**
 * 댓글 목록 조회 (무한 스크롤)
 */
export function useInfiniteComments(params?: Omit<GetCommentsParams, 'after'>) {
  const { getCommentsUseCase } = useDependencies();

  return useInfiniteQuery({
    queryKey: [COMMENT_QUERY_KEY, 'infinite', params],
    queryFn: ({ pageParam }) =>
      getCommentsUseCase.execute({
        ...params,
        after: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.endCursor : undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

/**
 * 댓글 삭제
 */
export function useDeleteComment() {
  const { deleteCommentUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCommentUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENT_QUERY_KEY] });
    },
  });
}

/**
 * 댓글 숨김 처리
 */
export function useMinimizeComment() {
  const { minimizeCommentUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: MinimizeReason }) =>
      minimizeCommentUseCase.execute(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENT_QUERY_KEY] });
    },
  });
}

/**
 * 댓글 숨김 해제
 */
export function useUnminimizeComment() {
  const { unminimizeCommentUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unminimizeCommentUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENT_QUERY_KEY] });
    },
  });
}
