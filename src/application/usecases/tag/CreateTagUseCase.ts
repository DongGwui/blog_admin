import { ITagRepository, CreateTagData } from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';

export class CreateTagUseCase {
  constructor(private tagRepository: ITagRepository) {}

  async execute(data: CreateTagData): Promise<Tag> {
    if (!data.name || !data.name.trim()) {
      throw new Error('Tag name is required');
    }

    return this.tagRepository.create(data);
  }
}
