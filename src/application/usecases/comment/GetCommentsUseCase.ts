import {
  ICommentRepository,
  GetCommentsParams,
  GetCommentsResult,
} from '@/domain/repositories/ICommentRepository';

export class GetCommentsUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(params?: GetCommentsParams): Promise<GetCommentsResult> {
    return this.commentRepository.findAll(params);
  }
}
