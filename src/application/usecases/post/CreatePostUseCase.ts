import { IPostRepository, CreatePostData } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(data: CreatePostData): Promise<Post> {
    if (!data.title || !data.title.trim()) {
      throw new Error('Title is required');
    }

    if (!data.content || !data.content.trim()) {
      throw new Error('Content is required');
    }

    return this.postRepository.create(data);
  }
}
