export function Loading({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "w-full flex justify-center py-16"
          : "h-screen w-full flex justify-center items-center"
      }
      role="status"
      aria-label="Loading weather"
    >
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
      </div>
    </div>
  );
}
