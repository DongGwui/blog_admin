import {
  ICommentRepository,
  MinimizeReason,
} from '@/domain/repositories/ICommentRepository';

export class MinimizeCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(id: string, reason: MinimizeReason): Promise<void> {
    if (!id?.trim()) {
      throw new Error('댓글 ID가 필요합니다.');
    }

    if (!reason) {
      throw new Error('숨김 사유가 필요합니다.');
    }

    return this.commentRepository.minimize(id, reason);
  }
}
