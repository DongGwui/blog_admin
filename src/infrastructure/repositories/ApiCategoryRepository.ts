import {
  ICategoryRepository,
  CreateCategoryData,
  UpdateCategoryData,
} from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/Category';
import { ApiClient } from '../api/ApiClient';
import {
  CategoryMapper,
  CategoryListApiResponse,
  SingleCategoryApiResponse,
} from '../mappers/CategoryMapper';

export class ApiCategoryRepository implements ICategoryRepository {
  constructor(private apiClient: ApiClient) {}

  async findAll(): Promise<Category[]> {
    const response = await this.apiClient.get<CategoryListApiResponse>('/categories');
    return CategoryMapper.toDomainList(response);
  }

  async findById(id: number): Promise<Category | null> {
    try {
      const response = await this.apiClient.get<SingleCategoryApiResponse>(`/categories/${id}`);
      return CategoryMapper.toDomain(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const requestData = CategoryMapper.toCreateApiRequest(data);
    const response = await this.apiClient.post<SingleCategoryApiResponse>('/categories', requestData);
    return CategoryMapper.toDomain(response.data);
  }

  async update(id: number, data: UpdateCategoryData): Promise<Category> {
    const requestData = CategoryMapper.toUpdateApiRequest(data);
    const response = await this.apiClient.put<SingleCategoryApiResponse>(
      `/categories/${id}`,
      requestData
    );
    return CategoryMapper.toDomain(response.data);
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`/categories/${id}`);
  }
}
