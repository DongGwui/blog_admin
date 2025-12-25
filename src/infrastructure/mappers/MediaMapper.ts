import { Media } from '@/domain/entities/Media';
import { GetMediaResult } from '@/domain/repositories/IMediaRepository';

export interface MediaApiResponse {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  created_at: string;
}

export interface MediaListApiResponse {
  data: MediaApiResponse[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface SingleMediaApiResponse {
  data: MediaApiResponse;
}

export class MediaMapper {
  static toDomain(apiMedia: MediaApiResponse): Media {
    return {
      id: apiMedia.id,
      filename: apiMedia.filename,
      originalName: apiMedia.original_name,
      url: apiMedia.url,
      mimeType: apiMedia.mime_type,
      size: apiMedia.size,
      width: apiMedia.width,
      height: apiMedia.height,
      createdAt: new Date(apiMedia.created_at),
    };
  }

  static toDomainList(response: MediaListApiResponse): GetMediaResult {
    return {
      media: (response.data || []).map(this.toDomain),
      total: response.meta?.total ?? 0,
      page: response.meta?.page ?? 1,
      totalPages: response.meta?.total_pages ?? 0,
    };
  }
}
