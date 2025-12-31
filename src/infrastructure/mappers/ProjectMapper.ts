import { Project } from '@/domain/entities/Project';
import { CreateProjectData, UpdateProjectData } from '@/domain/repositories/IProjectRepository';

export interface ProjectApiResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string | null;
  images: string[];
  github_url: string | null;
  demo_url: string | null;
  tech_stack: string[];
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ProjectListApiResponse {
  data: ProjectApiResponse[];
}

export interface SingleProjectApiResponse {
  data: ProjectApiResponse;
}

export interface CreateProjectApiRequest {
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  thumbnail?: string | null;
  images?: string[];
  github_url?: string | null;
  demo_url?: string | null;
  tech_stack?: string[];
  is_featured?: boolean;
  sort_order?: number;
}

export interface UpdateProjectApiRequest {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  thumbnail?: string | null;
  images?: string[];
  github_url?: string | null;
  demo_url?: string | null;
  tech_stack?: string[];
  is_featured?: boolean;
  sort_order?: number;
}

export interface ReorderProjectsApiRequest {
  orders: Array<{ id: number; sort_order: number }>;
}

export class ProjectMapper {
  static toDomain(apiProject: ProjectApiResponse): Project {
    return {
      id: apiProject.id,
      title: apiProject.title,
      description: apiProject.description || '',
      content: apiProject.content || '',
      thumbnailUrl: apiProject.thumbnail,
      githubUrl: apiProject.github_url,
      demoUrl: apiProject.demo_url,
      techStack: apiProject.tech_stack || [],
      order: apiProject.sort_order,
      isVisible: apiProject.is_featured,
      createdAt: new Date(apiProject.created_at),
      updatedAt: apiProject.updated_at ? new Date(apiProject.updated_at) : new Date(apiProject.created_at),
    };
  }

  static toDomainList(response: ProjectListApiResponse): Project[] {
    return (response.data || []).map(this.toDomain);
  }

  static toCreateApiRequest(data: CreateProjectData): CreateProjectApiRequest {
    return {
      title: data.title,
      description: data.description,
      content: data.content,
      thumbnail: data.thumbnailUrl,
      github_url: data.githubUrl,
      demo_url: data.demoUrl,
      tech_stack: data.techStack,
      is_featured: data.isVisible,
    };
  }

  static toUpdateApiRequest(data: UpdateProjectData): UpdateProjectApiRequest {
    const request: UpdateProjectApiRequest = {};

    if (data.title !== undefined) request.title = data.title;
    if (data.description !== undefined) request.description = data.description;
    if (data.content !== undefined) request.content = data.content;
    if (data.thumbnailUrl !== undefined) request.thumbnail = data.thumbnailUrl;
    if (data.githubUrl !== undefined) request.github_url = data.githubUrl;
    if (data.demoUrl !== undefined) request.demo_url = data.demoUrl;
    if (data.techStack !== undefined) request.tech_stack = data.techStack;
    if (data.isVisible !== undefined) request.is_featured = data.isVisible;

    return request;
  }
}
