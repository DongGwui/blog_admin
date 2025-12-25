import { IPostRepository, UpdatePostData } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

export class UpdatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number, data: UpdatePostData): Promise<Post> {
    if (id <= 0) {
      throw new Error('Invalid post ID');
    }

    const existingPost = await this.postRepository.findById(id);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (data.title !== undefined && !data.title.trim()) {
      throw new Error('Title cannot be empty');
    }

    if (data.content !== undefined && !data.content.trim()) {
      throw new Error('Content cannot be empty');
    }

    return this.postRepository.update(id, data);
  }
}
