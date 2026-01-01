'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'circular' ? height : '100%'),
    height: height ?? (variant === 'text' ? '1em' : '100%'),
    background: 'var(--surface-elevated)',
  };

  return (
    <div
      className={`animate-pulse ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Common skeleton patterns
export function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <Skeleton height={20} width="60%" />
      <Skeleton height={16} width="80%" />
      <Skeleton height={16} width="40%" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="p-4"
        style={{
          background: 'var(--surface-elevated)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Skeleton height={20} width="30%" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="p-4 flex gap-4"
          style={{
            borderBottom: i < rows - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <Skeleton height={16} width="40%" />
          <Skeleton height={16} width="20%" />
          <Skeleton height={16} width="20%" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
