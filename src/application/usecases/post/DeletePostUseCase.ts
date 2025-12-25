import { IPostRepository } from '@/domain/repositories/IPostRepository';

export class DeletePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error('Invalid post ID');
    }

    const existingPost = await this.postRepository.findById(id);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    await this.postRepository.delete(id);
  }
}
