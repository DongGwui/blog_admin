import { describe, it, expect } from 'vitest';
import { Tag, createTag } from '@/domain/entities/Tag';

describe('Tag Entity', () => {
  describe('Tag interface', () => {
    it('should have required properties', () => {
      const tag: Tag = {
        id: 1,
        name: 'JavaScript',
        slug: 'javascript',
        postCount: 5,
      };

      expect(tag.id).toBe(1);
      expect(tag.name).toBe('JavaScript');
      expect(tag.slug).toBe('javascript');
      expect(tag.postCount).toBe(5);
    });
  });

  describe('createTag factory', () => {
    it('should create a tag with default values', () => {
      const tag = createTag({
        name: 'TypeScript',
      });

      expect(tag.name).toBe('TypeScript');
      expect(tag.slug).toBe('typescript');
      expect(tag.postCount).toBe(0);
    });

    it('should generate slug from name', () => {
      const tag = createTag({
        name: 'React Native',
      });

      expect(tag.slug).toBe('react-native');
    });
  });
});
