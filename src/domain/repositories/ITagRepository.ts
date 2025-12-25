import { Tag } from '../entities/Tag';

export interface CreateTagData {
  name: string;
  slug?: string;
}

export interface UpdateTagData {
  name?: string;
  slug?: string;
}

export interface ITagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: number): Promise<Tag | null>;
  create(data: CreateTagData): Promise<Tag>;
  update(id: number, data: UpdateTagData): Promise<Tag>;
  delete(id: number): Promise<void>;
}
