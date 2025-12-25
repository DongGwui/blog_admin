import { describe, it, expect, beforeEach } from 'vitest';
import { InsertImageUseCase } from '@/application/usecases/media/InsertImageUseCase';

describe('InsertImageUseCase', () => {
  let useCase: InsertImageUseCase;

  beforeEach(() => {
    useCase = new InsertImageUseCase();
  });

  describe('generateMarkdownImage', () => {
    it('should generate markdown image with url and alt text', () => {
      const url = 'https://example.com/image.jpg';
      const alt = 'My Image';

      const result = useCase.generateMarkdownImage(url, alt);

      expect(result).toBe('![My Image](https://example.com/image.jpg)');
    });

    it('should use default alt text when not provided', () => {
      const url = 'https://example.com/image.jpg';

      const result = useCase.generateMarkdownImage(url);

      expect(result).toBe('![image](https://example.com/image.jpg)');
    });

    it('should use default alt text when alt is empty string', () => {
      const url = 'https://example.com/image.jpg';

      const result = useCase.generateMarkdownImage(url, '');

      expect(result).toBe('![image](https://example.com/image.jpg)');
    });

    it('should handle URLs with special characters', () => {
      const url = 'https://example.com/path/to/image%20name.jpg?v=123';
      const alt = 'Special Image';

      const result = useCase.generateMarkdownImage(url, alt);

      expect(result).toBe('![Special Image](https://example.com/path/to/image%20name.jpg?v=123)');
    });

    it('should handle alt text with special characters', () => {
      const url = 'https://example.com/image.jpg';
      const alt = 'Image with "quotes" and [brackets]';

      const result = useCase.generateMarkdownImage(url, alt);

      expect(result).toBe('![Image with "quotes" and [brackets]](https://example.com/image.jpg)');
    });

    it('should throw error for empty URL', () => {
      expect(() => useCase.generateMarkdownImage('')).toThrow('URL is required');
    });

    it('should throw error for whitespace-only URL', () => {
      expect(() => useCase.generateMarkdownImage('   ')).toThrow('URL is required');
    });
  });

  describe('insertIntoContent', () => {
    it('should insert image at the end when no position specified', () => {
      const content = 'Hello world';
      const imageMarkdown = '![image](https://example.com/image.jpg)';

      const result = useCase.insertIntoContent(content, imageMarkdown);

      expect(result).toBe('Hello world\n\n![image](https://example.com/image.jpg)');
    });

    it('should insert image at specified position', () => {
      const content = 'Hello world';
      const imageMarkdown = '![image](https://example.com/image.jpg)';
      const position = 5; // After "Hello"

      const result = useCase.insertIntoContent(content, imageMarkdown, position);

      expect(result).toBe('Hello\n\n![image](https://example.com/image.jpg)\n\n world');
    });

    it('should insert at beginning when position is 0', () => {
      const content = 'Hello world';
      const imageMarkdown = '![image](https://example.com/image.jpg)';

      const result = useCase.insertIntoContent(content, imageMarkdown, 0);

      expect(result).toBe('![image](https://example.com/image.jpg)\n\nHello world');
    });

    it('should handle empty content', () => {
      const content = '';
      const imageMarkdown = '![image](https://example.com/image.jpg)';

      const result = useCase.insertIntoContent(content, imageMarkdown);

      expect(result).toBe('![image](https://example.com/image.jpg)');
    });

    it('should handle position beyond content length', () => {
      const content = 'Hello';
      const imageMarkdown = '![image](https://example.com/image.jpg)';
      const position = 100;

      const result = useCase.insertIntoContent(content, imageMarkdown, position);

      expect(result).toBe('Hello\n\n![image](https://example.com/image.jpg)');
    });

    it('should handle negative position by inserting at beginning', () => {
      const content = 'Hello world';
      const imageMarkdown = '![image](https://example.com/image.jpg)';

      const result = useCase.insertIntoContent(content, imageMarkdown, -1);

      expect(result).toBe('![image](https://example.com/image.jpg)\n\nHello world');
    });

    it('should preserve existing newlines in content', () => {
      const content = 'Hello\n\nWorld';
      const imageMarkdown = '![image](https://example.com/image.jpg)';

      const result = useCase.insertIntoContent(content, imageMarkdown);

      expect(result).toBe('Hello\n\nWorld\n\n![image](https://example.com/image.jpg)');
    });

    it('should not add extra newlines when content already ends with newlines', () => {
      const content = 'Hello world\n\n';
      const imageMarkdown = '![image](https://example.com/image.jpg)';

      const result = useCase.insertIntoContent(content, imageMarkdown);

      expect(result).toBe('Hello world\n\n![image](https://example.com/image.jpg)');
    });
  });

  describe('createImageMarkdownFromMedia', () => {
    it('should create markdown from Media object', () => {
      const media = {
        id: 1,
        filename: 'image.jpg',
        originalName: 'my-photo.jpg',
        url: 'https://example.com/image.jpg',
        mimeType: 'image/jpeg',
        size: 102400,
        width: 800,
        height: 600,
        createdAt: new Date(),
      };

      const result = useCase.createImageMarkdownFromMedia(media);

      expect(result).toBe('![my-photo.jpg](https://example.com/image.jpg)');
    });

    it('should use custom alt text over original name', () => {
      const media = {
        id: 1,
        filename: 'image.jpg',
        originalName: 'my-photo.jpg',
        url: 'https://example.com/image.jpg',
        mimeType: 'image/jpeg',
        size: 102400,
        width: 800,
        height: 600,
        createdAt: new Date(),
      };
      const customAlt = 'Custom Alt Text';

      const result = useCase.createImageMarkdownFromMedia(media, customAlt);

      expect(result).toBe('![Custom Alt Text](https://example.com/image.jpg)');
    });
  });
});
