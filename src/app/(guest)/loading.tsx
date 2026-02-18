import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function GuestHomeLoading() {
  return (
    <div className="bg-mitti-beige text-mitti-dark-brown">
      <section className="relative h-[65vh] sm:h-[75vh]">
        <Skeleton className="h-full w-full rounded-none" />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-mitti-khaki bg-white p-4 space-y-3">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <Skeleton className="h-52 w-full rounded-3xl" />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 space-y-6">
        <Skeleton className="h-8 w-72 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-mitti-khaki bg-white p-6 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
