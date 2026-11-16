export function DrawingCardSkeleton() {
  return (
    <div
      className="animate-pulse border-2 border-[#e9ecef] bg-white"
      style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
    >
      <div className="aspect-[4/3] border-b-2 border-dashed border-[#e9ecef] bg-[#f1f3f5]" />
      <div className="space-y-2 p-4">
        <div className="h-5 w-2/3 rounded bg-[#e9ecef]" />
        <div className="h-3 w-1/3 rounded bg-[#e9ecef]" />
      </div>
    </div>
  );
}

export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <DrawingCardSkeleton key={i} />
      ))}
    </div>
  );
}