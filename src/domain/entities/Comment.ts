/**
 * Comment Entity
 * GitHub Discussions 기반 giscus 댓글
 */

export interface CommentAuthor {
  login: string;
  avatarUrl: string;
}

export interface CommentReply {
  id: string;
  databaseId: number;
  body: string;
  author: CommentAuthor | null;
  createdAt: Date;
}

export interface Comment {
  id: string; // GraphQL node ID
  databaseId: number; // Discussion comment ID
  body: string;
  bodyHTML: string;
  author: CommentAuthor | null;
  discussionId: string; // Discussion node ID
  discussionTitle: string; // 연결된 Discussion 제목
  discussionUrl: string; // Discussion URL
  postSlug: string; // 블로그 포스트 slug (pathname에서 추출)
  createdAt: Date;
  updatedAt: Date;
  isMinimized: boolean; // 숨김 처리 여부
  minimizedReason: string | null;
  replies: CommentReply[];
  replyCount: number;
}

/**
 * Discussion URL에서 포스트 slug 추출
 * giscus mapping이 pathname 기반이므로 Discussion title에서 slug 추출
 * 예: "blog/my-first-post" -> "my-first-post"
 */
export function extractPostSlugFromTitle(discussionTitle: string): string {
  // Discussion title은 보통 pathname 형태: "blog/post-slug" 또는 "/blog/post-slug"
  const parts = discussionTitle.split('/').filter(Boolean);
  // 마지막 부분이 실제 slug
  return parts[parts.length - 1] || discussionTitle;
}

/**
 * 댓글 날짜 포맷팅
 */
export function formatCommentDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } else if (days > 0) {
    return `${days}일 전`;
  } else if (hours > 0) {
    return `${hours}시간 전`;
  } else if (minutes > 0) {
    return `${minutes}분 전`;
  } else {
    return '방금 전';
  }
}

/**
 * 댓글 본문 미리보기 생성
 */
export function getCommentPreview(body: string, maxLength: number = 100): string {
  // 마크다운 이미지/링크 제거
  const cleaned = body
    .replace(/!\[.*?\]\(.*?\)/g, '[이미지]')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '[코드]')
    .replace(/`[^`]+`/g, '[코드]')
    .replace(/#{1,6}\s/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  return cleaned.slice(0, maxLength).trim() + '...';
}
