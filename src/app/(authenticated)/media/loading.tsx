export default function MediaLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-6 space-y-2">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-100 rounded w-56" />
        </div>

        {/* Upload Area Skeleton */}
        <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 mb-6" />

        {/* Media Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
