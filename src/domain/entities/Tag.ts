export interface Tag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

export interface CreateTagParams {
  name: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createTag(params: CreateTagParams): Tag {
  return {
    id: 0,
    name: params.name,
    slug: generateSlug(params.name),
    postCount: 0,
  };
}
