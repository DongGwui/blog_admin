export interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  thumbnailUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  techStack: string[];
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectParams {
  title: string;
  description: string;
  content?: string;
  techStack: string[];
  thumbnailUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
}

export function createProject(params: CreateProjectParams): Project {
  const now = new Date();

  return {
    id: 0,
    title: params.title,
    description: params.description,
    content: params.content || '',
    thumbnailUrl: params.thumbnailUrl || null,
    githubUrl: params.githubUrl || null,
    demoUrl: params.demoUrl || null,
    techStack: params.techStack,
    order: 0,
    isVisible: true,
    createdAt: now,
    updatedAt: now,
  };
}
