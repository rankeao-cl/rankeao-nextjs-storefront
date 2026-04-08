export default function StorefrontLoading() {
  return (
    <div className="store-container py-8 animate-pulse space-y-8">
      {/* Carousel skeleton - matches ImageCarousel aspect ratio */}
      <div className="w-full aspect-[2/1] md:aspect-[3.5/1] bg-[var(--surface)] rounded-xl skeleton-shimmer" />
      {/* Tiles skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/2] bg-[var(--surface)] rounded-xl" />
        ))}
      </div>
      {/* Products skeleton */}
      <div>
        <div className="h-8 bg-[var(--surface-secondary)] rounded w-64 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[var(--surface)] rounded-xl overflow-hidden">
              <div className="aspect-square bg-[var(--surface)]" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-[var(--surface-secondary)] rounded w-3/4" />
                <div className="h-6 bg-[var(--surface-secondary)] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
