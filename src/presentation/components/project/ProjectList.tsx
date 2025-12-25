'use client';

import { useState, useCallback } from 'react';
import { Project } from '@/domain/entities/Project';
import {
  useProjects,
  useDeleteProject,
  useUpdateProject,
  useReorderProjects,
} from '@/presentation/hooks/useProjectQueries';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { Button } from '@/presentation/components/common/Button';

export function ProjectList() {
  const { data: projects, isLoading, error, refetch } = useProjects();
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();
  const reorderProjects = useReorderProjects();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetId: number) => {
      e.preventDefault();
      if (!projects || draggedId === null || draggedId === targetId) {
        setDraggedId(null);
        return;
      }

      const currentOrder = projects.map((p) => p.id);
      const draggedIndex = currentOrder.indexOf(draggedId);
      const targetIndex = currentOrder.indexOf(targetId);

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedId(null);
        return;
      }

      // Remove dragged item and insert at target position
      const newOrder = [...currentOrder];
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedId);

      setDraggedId(null);

      // Transform to { id, sortOrder } format
      const orders = newOrder.map((id, index) => ({ id, sortOrder: index }));

      try {
        await reorderProjects.mutateAsync(orders);
      } catch (error) {
        console.error('Reorder failed:', error);
      }
    },
    [projects, draggedId, reorderProjects]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteProject.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleToggleVisibility = async (project: Project) => {
    try {
      await updateProject.mutateAsync({
        id: project.id,
        data: { isVisible: !project.isVisible },
      });
    } catch (error) {
      console.error('Toggle visibility failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">프로젝트를 불러오는데 실패했습니다.</p>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    );
  }

  if (isCreating || editingProject) {
    return (
      <ProjectForm
        project={editingProject || undefined}
        onSave={() => {
          setIsCreating(false);
          setEditingProject(null);
        }}
        onCancel={() => {
          setIsCreating(false);
          setEditingProject(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">
            드래그하여 순서를 변경할 수 있습니다.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>새 프로젝트</Button>
      </div>

      {/* Project List */}
      {projects && projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              draggable
              onDragStart={(e) => handleDragStart(e, project.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, project.id)}
              onDragEnd={handleDragEnd}
              className="cursor-move"
            >
              {deleteConfirmId === project.id ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 mb-3">
                    &quot;{project.title}&quot; 프로젝트를 삭제하시겠습니까?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(project.id)}
                      disabled={deleteProject.isPending}
                    >
                      {deleteProject.isPending ? '삭제 중...' : '삭제'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteConfirmId(null)}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <ProjectCard
                  project={project}
                  onEdit={setEditingProject}
                  onDelete={(p) => setDeleteConfirmId(p.id)}
                  onToggleVisibility={handleToggleVisibility}
                  isDragging={draggedId === project.id}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          프로젝트가 없습니다. 새 프로젝트를 추가해보세요.
        </div>
      )}
    </div>
  );
}
