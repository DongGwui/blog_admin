import { IMediaRepository } from '@/domain/repositories/IMediaRepository';
import { Media } from '@/domain/entities/Media';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class UploadMediaUseCase {
  constructor(private mediaRepository: IMediaRepository) {}

  async execute(file: File): Promise<Media> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Only image files are allowed');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds maximum limit');
    }

    return this.mediaRepository.upload(file);
  }
}
