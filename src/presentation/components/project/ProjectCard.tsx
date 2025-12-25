'use client';

import { Project } from '@/domain/entities/Project';
import { Button } from '@/presentation/components/common/Button';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleVisibility: (project: Project) => void;
  isDragging?: boolean;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onToggleVisibility,
  isDragging = false,
}: ProjectCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${
        isDragging ? 'opacity-50 scale-105 shadow-lg' : ''
      } ${!project.isVisible ? 'opacity-60' : ''}`}
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
          {project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {project.description}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {!project.isVisible && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  숨김
                </span>
              )}
            </div>
          </div>

          {/* Tech Stack */}
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {project.techStack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 5 && (
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  +{project.techStack.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-3 mt-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Demo
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(project)}>
            수정
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleVisibility(project)}
          >
            {project.isVisible ? '숨기기' : '보이기'}
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(project)}
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
