import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

export class PublishPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number, publish: boolean): Promise<Post> {
    if (id <= 0) {
      throw new Error('Invalid post ID');
    }

    const existingPost = await this.postRepository.findById(id);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    const newStatus = publish ? 'published' : 'draft';
    return this.postRepository.updateStatus(id, newStatus);
  }
}
