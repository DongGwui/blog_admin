import { IMediaRepository, GetMediaParams, GetMediaResult } from '@/domain/repositories/IMediaRepository';

export class GetMediaListUseCase {
  constructor(private mediaRepository: IMediaRepository) {}

  async execute(params?: GetMediaParams): Promise<GetMediaResult> {
    return this.mediaRepository.findAll(params ?? {});
  }
}
