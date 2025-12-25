import { describe, it, expect } from 'vitest';
import { Media, isImage, getFileExtension } from '@/domain/entities/Media';

describe('Media Entity', () => {
  describe('Media interface', () => {
    it('should have required properties', () => {
      const media: Media = {
        id: 1,
        filename: 'abc123.jpg',
        originalName: 'my-photo.jpg',
        url: 'https://example.com/uploads/abc123.jpg',
        mimeType: 'image/jpeg',
        size: 102400,
        width: 1920,
        height: 1080,
        createdAt: new Date(),
      };

      expect(media.id).toBe(1);
      expect(media.filename).toBe('abc123.jpg');
      expect(media.mimeType).toBe('image/jpeg');
      expect(media.size).toBe(102400);
    });
  });

  describe('isImage helper', () => {
    it('should return true for image mime types', () => {
      expect(isImage('image/jpeg')).toBe(true);
      expect(isImage('image/png')).toBe(true);
      expect(isImage('image/gif')).toBe(true);
      expect(isImage('image/webp')).toBe(true);
    });

    it('should return false for non-image mime types', () => {
      expect(isImage('application/pdf')).toBe(false);
      expect(isImage('text/plain')).toBe(false);
    });
  });

  describe('getFileExtension helper', () => {
    it('should extract file extension', () => {
      expect(getFileExtension('photo.jpg')).toBe('jpg');
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('image.test.png')).toBe('png');
    });

    it('should return empty string for files without extension', () => {
      expect(getFileExtension('noextension')).toBe('');
    });
  });
});
