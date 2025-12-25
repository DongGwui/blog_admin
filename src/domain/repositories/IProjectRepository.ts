import { Project } from '../entities/Project';

export interface CreateProjectData {
  title: string;
  description: string;
  content?: string;
  thumbnailUrl?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  techStack: string[];
  isVisible?: boolean;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  content?: string;
  thumbnailUrl?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  techStack?: string[];
  isVisible?: boolean;
}

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: number): Promise<Project | null>;
  create(data: CreateProjectData): Promise<Project>;
  update(id: number, data: UpdateProjectData): Promise<Project>;
  delete(id: number): Promise<void>;
  reorder(ids: number[]): Promise<void>;
}
