import { ITagRepository, UpdateTagData } from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';

export class UpdateTagUseCase {
  constructor(private tagRepository: ITagRepository) {}

  async execute(id: number, data: UpdateTagData): Promise<Tag> {
    if (id <= 0) {
      throw new Error('Invalid tag ID');
    }

    const existingTag = await this.tagRepository.findById(id);

    if (!existingTag) {
      throw new Error('Tag not found');
    }

    if (data.name !== undefined && !data.name.trim()) {
      throw new Error('Tag name cannot be empty');
    }

    return this.tagRepository.update(id, data);
  }
}
