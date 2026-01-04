export interface Media {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  thumbnailSm?: string; // 150px - 목록 썸네일용
  thumbnailMd?: string; // 400px - 본문용
  mimeType: string;
  size: number;
  width: number;
  height: number;
  createdAt: Date;
}

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export function isImage(mimeType: string): boolean {
  return IMAGE_MIME_TYPES.includes(mimeType);
}

export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  return filename.slice(lastDotIndex + 1).toLowerCase();
}
