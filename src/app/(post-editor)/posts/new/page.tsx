'use client';

import { PostEditorPage } from '@/presentation/components/editor';
import { useCategories } from '@/presentation/hooks/queries/useCategoryQueries';
import { useTags } from '@/presentation/hooks/queries/useTagQueries';

export default function NewPostPage() {
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  // TODO: Implement image upload functionality with media API
  const handleImageUpload = async (file: File): Promise<string> => {
    // Placeholder - will be implemented when media API is integrated
    console.log('Image upload requested:', file.name);
    return URL.createObjectURL(file);
  };

  return (
    <PostEditorPage
      categories={categories}
      tags={tags}
      onImageUpload={handleImageUpload}
    />
  );
}
