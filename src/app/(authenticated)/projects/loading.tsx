export default function ProjectsLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-6 space-y-2">
          <div className="h-8 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-100 rounded w-56" />
        </div>

        {/* Projects List Skeleton */}
        <div className="max-w-4xl space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="flex gap-2 mt-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-5 bg-gray-200 rounded w-16" />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-8 bg-gray-200 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
