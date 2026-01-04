/**
 * GitHub GraphQL API Client
 * giscus 댓글 관리를 위한 GitHub Discussions API 클라이언트
 */

export interface GitHubGraphQLConfig {
  token: string;
  owner: string;
  repo: string;
  categoryId: string;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

export class GitHubGraphQLError extends Error {
  constructor(
    message: string,
    public errors?: Array<{ message: string }>
  ) {
    super(message);
    this.name = 'GitHubGraphQLError';
  }
}

export class GitHubGraphQLClient {
  private readonly endpoint = 'https://api.github.com/graphql';
  private readonly config: GitHubGraphQLConfig;

  constructor(config: GitHubGraphQLConfig) {
    this.config = config;
  }

  /**
   * GraphQL 쿼리 실행
   */
  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.token}`,
        'X-Github-Next-Global-ID': '1', // Use new global ID format
      },
      body: JSON.stringify({
        query,
        variables: {
          owner: this.config.owner,
          repo: this.config.repo,
          categoryId: this.config.categoryId,
          ...variables,
        },
      }),
    });

    if (!response.ok) {
      throw new GitHubGraphQLError(
        `GitHub API request failed: ${response.status} ${response.statusText}`
      );
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new GitHubGraphQLError(
        result.errors.map((e) => e.message).join(', '),
        result.errors
      );
    }

    if (!result.data) {
      throw new GitHubGraphQLError('No data returned from GitHub API');
    }

    return result.data;
  }

  /**
   * GraphQL 뮤테이션 실행
   */
  async mutate<T>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
    return this.query<T>(mutation, variables);
  }

  /**
   * Config 정보 반환
   */
  getConfig(): Readonly<GitHubGraphQLConfig> {
    return { ...this.config };
  }
}

/**
 * 환경 변수에서 GitHub GraphQL 클라이언트 생성
 */
export function createGitHubGraphQLClient(): GitHubGraphQLClient {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const owner = process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER;
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME;
  const categoryId = process.env.NEXT_PUBLIC_GITHUB_CATEGORY_ID;

  if (!token) {
    throw new Error('NEXT_PUBLIC_GITHUB_TOKEN is required');
  }
  if (!owner) {
    throw new Error('NEXT_PUBLIC_GITHUB_REPO_OWNER is required');
  }
  if (!repo) {
    throw new Error('NEXT_PUBLIC_GITHUB_REPO_NAME is required');
  }
  if (!categoryId) {
    throw new Error('NEXT_PUBLIC_GITHUB_CATEGORY_ID is required');
  }

  return new GitHubGraphQLClient({
    token,
    owner,
    repo,
    categoryId,
  });
}
