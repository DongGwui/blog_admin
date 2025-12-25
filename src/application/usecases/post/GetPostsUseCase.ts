import { IPostRepository, GetPostsParams, GetPostsResult } from '@/domain/repositories/IPostRepository';

export class GetPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(params?: GetPostsParams): Promise<GetPostsResult> {
    return this.postRepository.findAll(params || {});
  }
}
