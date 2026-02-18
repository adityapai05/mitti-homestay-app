import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";
import StayCardSkeleton from "./_components/StayCardSkeleton";

export default function LoadingMyStays() {
  return (
    <main className="min-h-screen bg-mitti-beige">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <header>
          <Skeleton className="h-8 w-52" />
          <Skeleton className="mt-2 h-4 w-72" />
        </header>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <StayCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
