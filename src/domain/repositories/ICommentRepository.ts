import { Comment } from '../entities/Comment';

export interface GetCommentsParams {
  first?: number; // 가져올 개수 (기본 20)
  after?: string; // 커서 기반 페이지네이션
  postSlug?: string; // 특정 포스트의 댓글만 필터링
}

export interface GetCommentsResult {
  comments: Comment[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string | null;
}

export type MinimizeReason =
  | 'ABUSE'
  | 'OFF_TOPIC'
  | 'OUTDATED'
  | 'RESOLVED'
  | 'DUPLICATE'
  | 'SPAM';

export interface ICommentRepository {
  /**
   * 댓글 목록 조회
   */
  findAll(params?: GetCommentsParams): Promise<GetCommentsResult>;

  /**
   * 댓글 삭제
   * @param id GraphQL node ID
   */
  delete(id: string): Promise<void>;

  /**
   * 댓글 숨김 처리
   * @param id GraphQL node ID
   * @param reason 숨김 사유
   */
  minimize(id: string, reason: MinimizeReason): Promise<void>;

  /**
   * 댓글 숨김 해제
   * @param id GraphQL node ID
   */
  unminimize(id: string): Promise<void>;
}
