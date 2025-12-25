import { IMediaRepository } from '@/domain/repositories/IMediaRepository';

export class DeleteMediaUseCase {
  constructor(private mediaRepository: IMediaRepository) {}

  async execute(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error('Invalid media ID');
    }

    // API에 미디어 단건 조회 엔드포인트가 없으므로 바로 삭제
    // 존재하지 않는 미디어는 API에서 404 반환
    await this.mediaRepository.delete(id);
  }
}
