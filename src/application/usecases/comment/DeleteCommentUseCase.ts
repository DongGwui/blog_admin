import { ICommentRepository } from '@/domain/repositories/ICommentRepository';

export class DeleteCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('댓글 ID가 필요합니다.');
    }

    return this.commentRepository.delete(id);
  }
}
