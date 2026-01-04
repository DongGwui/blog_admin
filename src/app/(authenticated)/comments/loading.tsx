export default function CommentsLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-6 space-y-2">
          <div
            className="h-8 rounded w-40"
            style={{ background: 'var(--surface-elevated)' }}
          />
          <div
            className="h-4 rounded w-80"
            style={{ background: 'var(--surface)' }}
          />
        </div>

        {/* Filter Skeleton */}
        <div className="max-w-4xl mb-4">
          <div
            className="h-11 rounded-xl"
            style={{ background: 'var(--surface-elevated)' }}
          />
        </div>

        {/* Stats Skeleton */}
        <div className="max-w-4xl mb-4">
          <div
            className="h-10 rounded-lg"
            style={{ background: 'var(--surface)' }}
          />
        </div>

        {/* Comments List Skeleton */}
        <div className="max-w-4xl space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ background: 'var(--surface-elevated)' }}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: 'var(--surface)' }}
                />
                <div className="flex-1 space-y-2">
                  {/* Name & Date */}
                  <div className="flex gap-2">
                    <div
                      className="h-4 rounded w-24"
                      style={{ background: 'var(--surface)' }}
                    />
                    <div
                      className="h-4 rounded w-16"
                      style={{ background: 'var(--surface)' }}
                    />
                  </div>
                  {/* Content */}
                  <div
                    className="h-4 rounded w-full"
                    style={{ background: 'var(--surface)' }}
                  />
                  <div
                    className="h-4 rounded w-3/4"
                    style={{ background: 'var(--surface)' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
