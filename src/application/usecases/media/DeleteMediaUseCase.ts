import { IMediaRepository } from '@/domain/repositories/IMediaRepository';

export class DeleteMediaUseCase {
  constructor(private mediaRepository: IMediaRepository) {}

  async execute(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error('Invalid media ID');
    }

    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new Error('Media not found');
    }

    await this.mediaRepository.delete(id);
  }
}
