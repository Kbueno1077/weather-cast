export function Loading({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "w-full flex justify-center py-16"
          : "h-screen w-full flex justify-center items-center"
      }
    >
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent" />
    </div>
  );
}
