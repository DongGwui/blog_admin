import { Media } from '../entities/Media';

export interface GetMediaParams {
  page?: number;
  limit?: number;
}

export interface GetMediaResult {
  media: Media[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IMediaRepository {
  findAll(params?: GetMediaParams): Promise<GetMediaResult>;
  findById(id: number): Promise<Media | null>;
  upload(file: File): Promise<Media>;
  delete(id: number): Promise<void>;
}
