import { ITagRepository } from '@/domain/repositories/ITagRepository';

export class DeleteTagUseCase {
  constructor(private tagRepository: ITagRepository) {}

  async execute(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error('Invalid tag ID');
    }

    const existingTag = await this.tagRepository.findById(id);

    if (!existingTag) {
      throw new Error('Tag not found');
    }

    await this.tagRepository.delete(id);
  }
}
