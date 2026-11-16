import { CardsSkeleton } from "@/components/DrawingCardSkeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10">
      <h1 className="font-virgil text-3xl font-bold text-[#1e1e1e]">My Boards</h1>
      <CardsSkeleton />
    </div>
  );
}