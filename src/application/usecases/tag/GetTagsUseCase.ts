import { ITagRepository } from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';

export class GetTagsUseCase {
  constructor(private tagRepository: ITagRepository) {}

  async execute(): Promise<Tag[]> {
    return this.tagRepository.findAll();
  }
}
