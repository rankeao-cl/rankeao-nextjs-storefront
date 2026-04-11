export default function TournamentCardSkeleton() {
  return (
    <div className="surface-card rounded-card overflow-hidden flex flex-col border border-border/50 animate-pulse">
      {/* Banner placeholder */}
      <div className="aspect-video bg-[var(--surface)]" />
      <div className="p-5 flex flex-col flex-grow gap-3">
        {/* Game + format badges */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[var(--surface-secondary)]" />
          <div className="h-3 bg-[var(--surface-secondary)] rounded w-20" />
          <div className="h-3 bg-[var(--surface)] rounded w-16" />
        </div>
        {/* Title */}
        <div className="h-5 bg-[var(--surface-secondary)] rounded w-3/4" />
        <div className="h-4 bg-[var(--surface)] rounded w-1/2" />
        {/* Date + location */}
        <div className="space-y-2 mt-auto pt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[var(--surface)] rounded" />
            <div className="h-3 bg-[var(--surface)] rounded w-40" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[var(--surface)] rounded" />
            <div className="h-3 bg-[var(--surface)] rounded w-24" />
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 mt-2 border-t border-border/40">
          <div className="space-y-1">
            <div className="h-2.5 bg-[var(--surface)] rounded w-14" />
            <div className="h-4 bg-[var(--surface-secondary)] rounded w-16" />
          </div>
          <div className="space-y-1 items-end flex flex-col">
            <div className="h-2.5 bg-[var(--surface)] rounded w-14" />
            <div className="h-4 bg-[var(--surface-secondary)] rounded w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TournamentGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TournamentCardSkeleton key={i} />
      ))}
    </div>
  );
}
