export function LoadingState() {
  return (
    <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
      <div className="h-8 bg-[var(--card-background)] rounded w-1/3"></div>
      <div className="h-4 bg-[var(--card-background)] rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-10 bg-[var(--card-background)] rounded"></div>
        <div className="h-10 bg-[var(--card-background)] rounded"></div>
        <div className="h-32 bg-[var(--card-background)] rounded"></div>
      </div>
    </div>
  );
}
