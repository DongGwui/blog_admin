import {
  ICommentRepository,
  GetCommentsParams,
  GetCommentsResult,
  MinimizeReason,
} from '@/domain/repositories/ICommentRepository';
import { GitHubGraphQLClient } from '@/infrastructure/api/GitHubGraphQLClient';
import {
  CommentMapper,
  GitHubDiscussionsResponse,
} from '@/infrastructure/mappers/CommentMapper';

/**
 * GraphQL Queries
 */
const GET_DISCUSSIONS_WITH_COMMENTS = `
  query GetDiscussionsWithComments(
    $owner: String!
    $repo: String!
    $categoryId: ID!
    $first: Int!
    $after: String
  ) {
    repository(owner: $owner, name: $repo) {
      discussions(
        categoryId: $categoryId
        first: $first
        after: $after
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          url
          comments(first: 100) {
            nodes {
              id
              databaseId
              body
              bodyHTML
              author {
                login
                avatarUrl
              }
              createdAt
              updatedAt
              isMinimized
              minimizedReason
              replies(first: 50) {
                nodes {
                  id
                  databaseId
                  body
                  author {
                    login
                    avatarUrl
                  }
                  createdAt
                }
                totalCount
              }
            }
            totalCount
          }
        }
      }
    }
  }
`;

/**
 * GraphQL Mutations
 */
const DELETE_DISCUSSION_COMMENT = `
  mutation DeleteDiscussionComment($id: ID!) {
    deleteDiscussionComment(input: { id: $id }) {
      clientMutationId
    }
  }
`;

const MINIMIZE_COMMENT = `
  mutation MinimizeComment($id: ID!, $classifier: ReportedContentClassifiers!) {
    minimizeComment(input: { subjectId: $id, classifier: $classifier }) {
      clientMutationId
      minimizedComment {
        isMinimized
        minimizedReason
      }
    }
  }
`;

const UNMINIMIZE_COMMENT = `
  mutation UnminimizeComment($id: ID!) {
    unminimizeComment(input: { subjectId: $id }) {
      clientMutationId
      unminimizedComment {
        isMinimized
      }
    }
  }
`;

/**
 * MinimizeReason을 GitHub의 ReportedContentClassifiers로 변환
 */
function toGitHubClassifier(reason: MinimizeReason): string {
  const classifierMap: Record<MinimizeReason, string> = {
    ABUSE: 'ABUSE',
    OFF_TOPIC: 'OFF_TOPIC',
    OUTDATED: 'OUTDATED',
    RESOLVED: 'RESOLVED',
    DUPLICATE: 'DUPLICATE',
    SPAM: 'SPAM',
  };
  return classifierMap[reason];
}

/**
 * GitHub Comment Repository
 * GitHub GraphQL API를 사용하여 giscus 댓글 관리
 */
export class GitHubCommentRepository implements ICommentRepository {
  constructor(private readonly client: GitHubGraphQLClient) {}

  /**
   * 댓글 목록 조회
   */
  async findAll(params?: GetCommentsParams): Promise<GetCommentsResult> {
    const first = params?.first ?? 20;
    const after = params?.after ?? null;

    const response = await this.client.query<GitHubDiscussionsResponse>(
      GET_DISCUSSIONS_WITH_COMMENTS,
      { first, after }
    );

    const result = CommentMapper.toDomainList(response);

    // postSlug 필터링
    if (params?.postSlug) {
      const filtered = CommentMapper.filterByPostSlug(result.comments, params.postSlug);
      return {
        comments: filtered,
        totalCount: filtered.length,
        hasNextPage: result.hasNextPage,
        endCursor: result.endCursor,
      };
    }

    return {
      comments: result.comments,
      totalCount: result.totalCount,
      hasNextPage: result.hasNextPage,
      endCursor: result.endCursor,
    };
  }

  /**
   * 댓글 삭제
   * 주의: 삭제 권한이 있는 경우에만 동작 (본인 댓글 또는 repo 관리자)
   */
  async delete(id: string): Promise<void> {
    await this.client.mutate(DELETE_DISCUSSION_COMMENT, { id });
  }

  /**
   * 댓글 숨김 처리
   */
  async minimize(id: string, reason: MinimizeReason): Promise<void> {
    const classifier = toGitHubClassifier(reason);
    await this.client.mutate(MINIMIZE_COMMENT, { id, classifier });
  }

  /**
   * 댓글 숨김 해제
   */
  async unminimize(id: string): Promise<void> {
    await this.client.mutate(UNMINIMIZE_COMMENT, { id });
  }
}
