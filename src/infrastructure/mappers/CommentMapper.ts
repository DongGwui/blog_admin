import {
  Comment,
  CommentAuthor,
  CommentReply,
  extractPostSlugFromTitle,
} from '@/domain/entities/Comment';

/**
 * GitHub GraphQL API Response Types
 */

export interface GitHubAuthorResponse {
  login: string;
  avatarUrl: string;
}

export interface GitHubCommentReplyResponse {
  id: string;
  databaseId: number;
  body: string;
  author: GitHubAuthorResponse | null;
  createdAt: string;
}

export interface GitHubCommentResponse {
  id: string;
  databaseId: number;
  body: string;
  bodyHTML: string;
  author: GitHubAuthorResponse | null;
  createdAt: string;
  updatedAt: string;
  isMinimized: boolean;
  minimizedReason: string | null;
  replies: {
    nodes: GitHubCommentReplyResponse[];
    totalCount: number;
  };
}

export interface GitHubDiscussionResponse {
  id: string;
  title: string;
  url: string;
  comments: {
    nodes: GitHubCommentResponse[];
    totalCount: number;
  };
}

export interface GitHubDiscussionsResponse {
  repository: {
    discussions: {
      totalCount: number;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: GitHubDiscussionResponse[];
    };
  };
}

/**
 * Comment Mapper
 * GitHub GraphQL API 응답을 Domain 엔티티로 변환
 */
export class CommentMapper {
  /**
   * GitHub Author → Domain CommentAuthor
   */
  static toAuthorDomain(response: GitHubAuthorResponse | null): CommentAuthor | null {
    if (!response) return null;
    return {
      login: response.login,
      avatarUrl: response.avatarUrl,
    };
  }

  /**
   * GitHub Reply → Domain CommentReply
   */
  static toReplyDomain(response: GitHubCommentReplyResponse): CommentReply {
    return {
      id: response.id,
      databaseId: response.databaseId,
      body: response.body,
      author: this.toAuthorDomain(response.author),
      createdAt: new Date(response.createdAt),
    };
  }

  /**
   * GitHub Comment + Discussion info → Domain Comment
   */
  static toCommentDomain(
    comment: GitHubCommentResponse,
    discussion: GitHubDiscussionResponse
  ): Comment {
    return {
      id: comment.id,
      databaseId: comment.databaseId,
      body: comment.body,
      bodyHTML: comment.bodyHTML,
      author: this.toAuthorDomain(comment.author),
      discussionId: discussion.id,
      discussionTitle: discussion.title,
      discussionUrl: discussion.url,
      postSlug: extractPostSlugFromTitle(discussion.title),
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
      isMinimized: comment.isMinimized,
      minimizedReason: comment.minimizedReason,
      replies: comment.replies.nodes.map((reply) => this.toReplyDomain(reply)),
      replyCount: comment.replies.totalCount,
    };
  }

  /**
   * GitHub Discussions Response → Domain Comments 리스트
   * Discussion의 모든 댓글을 플랫하게 변환
   */
  static toDomainList(response: GitHubDiscussionsResponse): {
    comments: Comment[];
    totalCount: number;
    hasNextPage: boolean;
    endCursor: string | null;
  } {
    const comments: Comment[] = [];

    for (const discussion of response.repository.discussions.nodes) {
      for (const comment of discussion.comments.nodes) {
        comments.push(this.toCommentDomain(comment, discussion));
      }
    }

    // 최신순 정렬
    comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      comments,
      totalCount: comments.length, // 실제 댓글 수
      hasNextPage: response.repository.discussions.pageInfo.hasNextPage,
      endCursor: response.repository.discussions.pageInfo.endCursor,
    };
  }

  /**
   * 특정 포스트 slug로 필터링
   */
  static filterByPostSlug(comments: Comment[], postSlug: string): Comment[] {
    return comments.filter((comment) =>
      comment.postSlug.toLowerCase().includes(postSlug.toLowerCase())
    );
  }
}
