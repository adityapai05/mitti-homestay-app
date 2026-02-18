import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function AboutLoading() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="relative w-full h-[65vh] sm:h-[70vh] overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
      </section>

      <section className="px-6 py-14 sm:py-20 flex justify-center">
        <div className="max-w-5xl w-full space-y-5">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
        </div>
      </section>

      <section className="px-6 py-10 flex justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-14 flex justify-center">
        <div className="max-w-6xl w-full rounded-2xl border border-mitti-khaki bg-mitti-cream p-10 sm:p-14 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
        </div>
      </section>

      <section className="px-6 py-10 flex justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 flex justify-center">
        <div className="max-w-6xl w-full space-y-8">
          <Skeleton className="h-px w-full rounded-none" />
          <div className="flex justify-center gap-8">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </section>
    </main>
  );
}
