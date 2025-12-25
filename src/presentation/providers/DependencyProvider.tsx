'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Infrastructure
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { TokenStorage } from '@/infrastructure/auth/TokenStorage';
import { ApiAuthRepository } from '@/infrastructure/repositories/ApiAuthRepository';
import { ApiPostRepository } from '@/infrastructure/repositories/ApiPostRepository';
import { ApiCategoryRepository } from '@/infrastructure/repositories/ApiCategoryRepository';
import { ApiTagRepository } from '@/infrastructure/repositories/ApiTagRepository';
import { ApiMediaRepository } from '@/infrastructure/repositories/ApiMediaRepository';
import { ApiProjectRepository } from '@/infrastructure/repositories/ApiProjectRepository';

// Use Cases - Auth
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { LogoutUseCase } from '@/application/usecases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';

// Use Cases - Post
import {
  CreatePostUseCase,
  GetPostsUseCase,
  GetPostByIdUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  PublishPostUseCase,
} from '@/application/usecases/post';

// Use Cases - Category
import {
  GetCategoriesUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '@/application/usecases/category';

// Use Cases - Tag
import {
  GetTagsUseCase,
  CreateTagUseCase,
  UpdateTagUseCase,
  DeleteTagUseCase,
} from '@/application/usecases/tag';

// Use Cases - Media
import {
  GetMediaListUseCase,
  UploadMediaUseCase,
  DeleteMediaUseCase,
} from '@/application/usecases/media';

// Use Cases - Project
import {
  GetProjectsUseCase,
  GetProjectByIdUseCase,
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  ReorderProjectsUseCase,
} from '@/application/usecases/project';

export interface Dependencies {
  // Infrastructure
  tokenStorage: TokenStorage;

  // Auth Use Cases
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;
  getCurrentUserUseCase: GetCurrentUserUseCase;

  // Post Use Cases
  createPostUseCase: CreatePostUseCase;
  getPostsUseCase: GetPostsUseCase;
  getPostByIdUseCase: GetPostByIdUseCase;
  updatePostUseCase: UpdatePostUseCase;
  deletePostUseCase: DeletePostUseCase;
  publishPostUseCase: PublishPostUseCase;

  // Category Use Cases
  getCategoriesUseCase: GetCategoriesUseCase;
  createCategoryUseCase: CreateCategoryUseCase;
  updateCategoryUseCase: UpdateCategoryUseCase;
  deleteCategoryUseCase: DeleteCategoryUseCase;

  // Tag Use Cases
  getTagsUseCase: GetTagsUseCase;
  createTagUseCase: CreateTagUseCase;
  updateTagUseCase: UpdateTagUseCase;
  deleteTagUseCase: DeleteTagUseCase;

  // Media Use Cases
  getMediaListUseCase: GetMediaListUseCase;
  uploadMediaUseCase: UploadMediaUseCase;
  deleteMediaUseCase: DeleteMediaUseCase;

  // Project Use Cases
  getProjectsUseCase: GetProjectsUseCase;
  getProjectByIdUseCase: GetProjectByIdUseCase;
  createProjectUseCase: CreateProjectUseCase;
  updateProjectUseCase: UpdateProjectUseCase;
  deleteProjectUseCase: DeleteProjectUseCase;
  reorderProjectsUseCase: ReorderProjectsUseCase;
}

const DependencyContext = createContext<Dependencies | null>(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface DependencyProviderProps {
  children: ReactNode;
}

export function DependencyProvider({ children }: DependencyProviderProps) {
  const dependencies = useMemo(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://blog-api.dltmxm.link/api/admin';

    // Infrastructure
    const tokenStorage = new TokenStorage();
    const apiClient = new ApiClient({
      baseURL: apiUrl,
      tokenStorage,
      onUnauthorized: () => {
        // Using window.location for redirect outside React context
        // This is intentional for handling 401 errors globally
        window.location.assign('/login');
      },
    });

    // Repositories
    const authRepository = new ApiAuthRepository(apiClient, tokenStorage);
    const postRepository = new ApiPostRepository(apiClient);
    const categoryRepository = new ApiCategoryRepository(apiClient);
    const tagRepository = new ApiTagRepository(apiClient);
    const mediaRepository = new ApiMediaRepository(apiClient);
    const projectRepository = new ApiProjectRepository(apiClient);

    // Use Cases
    return {
      tokenStorage,
      // Auth
      loginUseCase: new LoginUseCase(authRepository),
      logoutUseCase: new LogoutUseCase(authRepository),
      getCurrentUserUseCase: new GetCurrentUserUseCase(authRepository),
      // Post
      createPostUseCase: new CreatePostUseCase(postRepository),
      getPostsUseCase: new GetPostsUseCase(postRepository),
      getPostByIdUseCase: new GetPostByIdUseCase(postRepository),
      updatePostUseCase: new UpdatePostUseCase(postRepository),
      deletePostUseCase: new DeletePostUseCase(postRepository),
      publishPostUseCase: new PublishPostUseCase(postRepository),
      // Category
      getCategoriesUseCase: new GetCategoriesUseCase(categoryRepository),
      createCategoryUseCase: new CreateCategoryUseCase(categoryRepository),
      updateCategoryUseCase: new UpdateCategoryUseCase(categoryRepository),
      deleteCategoryUseCase: new DeleteCategoryUseCase(categoryRepository),
      // Tag
      getTagsUseCase: new GetTagsUseCase(tagRepository),
      createTagUseCase: new CreateTagUseCase(tagRepository),
      updateTagUseCase: new UpdateTagUseCase(tagRepository),
      deleteTagUseCase: new DeleteTagUseCase(tagRepository),
      // Media
      getMediaListUseCase: new GetMediaListUseCase(mediaRepository),
      uploadMediaUseCase: new UploadMediaUseCase(mediaRepository),
      deleteMediaUseCase: new DeleteMediaUseCase(mediaRepository),
      // Project
      getProjectsUseCase: new GetProjectsUseCase(projectRepository),
      getProjectByIdUseCase: new GetProjectByIdUseCase(projectRepository),
      createProjectUseCase: new CreateProjectUseCase(projectRepository),
      updateProjectUseCase: new UpdateProjectUseCase(projectRepository),
      deleteProjectUseCase: new DeleteProjectUseCase(projectRepository),
      reorderProjectsUseCase: new ReorderProjectsUseCase(projectRepository),
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <DependencyContext.Provider value={dependencies}>
        {children}
      </DependencyContext.Provider>
    </QueryClientProvider>
  );
}

export function useDependencies(): Dependencies {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error('useDependencies must be used within DependencyProvider');
  }
  return context;
}
