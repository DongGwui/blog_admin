import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

export class GetPostByIdUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number): Promise<Post> {
    if (id <= 0) {
      throw new Error('Invalid post ID');
    }

    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }
}
