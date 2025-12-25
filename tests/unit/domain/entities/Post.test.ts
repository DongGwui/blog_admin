import { describe, it, expect } from 'vitest';
import { Post, PostStatus, createPost } from '@/domain/entities/Post';

describe('Post Entity', () => {
  describe('Post interface', () => {
    it('should have required properties', () => {
      const post: Post = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: 'This is test content',
        excerpt: 'Test excerpt',
        status: 'draft',
        categoryId: 1,
        tagIds: [1, 2],
        thumbnail: null,
        viewCount: 0,
        readingTime: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
      };

      expect(post.id).toBe(1);
      expect(post.title).toBe('Test Post');
      expect(post.slug).toBe('test-post');
      expect(post.status).toBe('draft');
    });

    it('should allow published status', () => {
      const status: PostStatus = 'published';
      expect(status).toBe('published');
    });

    it('should allow draft status', () => {
      const status: PostStatus = 'draft';
      expect(status).toBe('draft');
    });
  });

  describe('createPost factory', () => {
    it('should create a post with default values', () => {
      const post = createPost({
        title: 'New Post',
        content: 'Post content here',
      });

      expect(post.title).toBe('New Post');
      expect(post.content).toBe('Post content here');
      expect(post.status).toBe('draft');
      expect(post.slug).toBe('new-post');
      expect(post.viewCount).toBe(0);
      expect(post.publishedAt).toBeNull();
    });

    it('should generate slug from title', () => {
      const post = createPost({
        title: 'Hello World Test',
        content: 'Content',
      });

      expect(post.slug).toBe('hello-world-test');
    });

    it('should calculate reading time based on content', () => {
      const content = 'word '.repeat(400); // 400 words
      const post = createPost({
        title: 'Long Post',
        content,
      });

      expect(post.readingTime).toBe(2); // 400 words / 200 wpm = 2 minutes
    });

    it('should set excerpt from content if not provided', () => {
      const content = 'This is a very long content '.repeat(20);
      const post = createPost({
        title: 'Post',
        content,
      });

      expect(post.excerpt.length).toBeLessThanOrEqual(203); // 200 chars + '...'
    });

    it('should use provided excerpt if given', () => {
      const post = createPost({
        title: 'Post',
        content: 'Content',
        excerpt: 'Custom excerpt',
      });

      expect(post.excerpt).toBe('Custom excerpt');
    });
  });
});
