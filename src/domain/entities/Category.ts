export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
  createdAt: Date;
}

export interface CreateCategoryParams {
  name: string;
  description?: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createCategory(params: CreateCategoryParams): Category {
  return {
    id: 0,
    name: params.name,
    slug: generateSlug(params.name),
    description: params.description || null,
    postCount: 0,
    createdAt: new Date(),
  };
}
