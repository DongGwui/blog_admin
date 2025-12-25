import { describe, it, expect } from 'vitest';
import { Project, createProject } from '@/domain/entities/Project';

describe('Project Entity', () => {
  describe('Project interface', () => {
    it('should have required properties', () => {
      const project: Project = {
        id: 1,
        title: 'Blog Admin',
        description: 'Admin panel for blog',
        content: 'Detailed content',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        githubUrl: 'https://github.com/user/repo',
        demoUrl: 'https://demo.example.com',
        techStack: ['Next.js', 'TypeScript', 'Tailwind'],
        order: 1,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(project.id).toBe(1);
      expect(project.title).toBe('Blog Admin');
      expect(project.techStack).toContain('Next.js');
      expect(project.order).toBe(1);
    });

    it('should allow null for optional URLs', () => {
      const project: Project = {
        id: 1,
        title: 'Private Project',
        description: 'No public links',
        content: 'Content',
        thumbnailUrl: null,
        githubUrl: null,
        demoUrl: null,
        techStack: ['Python'],
        order: 2,
        isVisible: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(project.githubUrl).toBeNull();
      expect(project.demoUrl).toBeNull();
    });
  });

  describe('createProject factory', () => {
    it('should create a project with default values', () => {
      const project = createProject({
        title: 'New Project',
        description: 'Description',
        techStack: ['React'],
      });

      expect(project.title).toBe('New Project');
      expect(project.isVisible).toBe(true);
      expect(project.order).toBe(0);
    });
  });
});
