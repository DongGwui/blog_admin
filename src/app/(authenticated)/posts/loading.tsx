export default function PostsLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-6 flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-100 rounded w-48" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-28" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-9 bg-gray-200 rounded w-20" />
          ))}
        </div>

        {/* Posts List Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
