import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function ExploreLoading() {
  return (
    <main className="bg-mitti-beige text-mitti-dark-brown">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6">
          <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
            <Skeleton className="h-16 sm:h-20 w-full rounded-2xl sm:rounded-full" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-full sm:w-[220px] rounded-full" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-md"
              >
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="flex items-center justify-between px-4 py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 py-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-24" />
          </div>
        </section>
      </div>
    </main>
  );
}
