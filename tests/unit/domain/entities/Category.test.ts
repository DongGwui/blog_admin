import { describe, it, expect } from 'vitest';
import { Category, createCategory } from '@/domain/entities/Category';

describe('Category Entity', () => {
  describe('Category interface', () => {
    it('should have required properties', () => {
      const category: Category = {
        id: 1,
        name: 'Technology',
        slug: 'technology',
        description: 'Tech related posts',
        postCount: 10,
        createdAt: new Date(),
      };

      expect(category.id).toBe(1);
      expect(category.name).toBe('Technology');
      expect(category.slug).toBe('technology');
      expect(category.postCount).toBe(10);
    });

    it('should allow null description', () => {
      const category: Category = {
        id: 1,
        name: 'General',
        slug: 'general',
        description: null,
        postCount: 0,
        createdAt: new Date(),
      };

      expect(category.description).toBeNull();
    });
  });

  describe('createCategory factory', () => {
    it('should create a category with default values', () => {
      const category = createCategory({
        name: 'Programming',
      });

      expect(category.name).toBe('Programming');
      expect(category.slug).toBe('programming');
      expect(category.postCount).toBe(0);
    });

    it('should generate slug from name', () => {
      const category = createCategory({
        name: 'Web Development',
      });

      expect(category.slug).toBe('web-development');
    });
  });
});
