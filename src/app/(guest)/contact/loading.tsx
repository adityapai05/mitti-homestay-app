import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function ContactLoading() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-6 py-12 flex justify-center">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10 space-y-4">
            <Skeleton className="h-14 w-14 rounded-full mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-10 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>

          <Skeleton className="h-px w-full rounded-none mb-8" />

          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}

            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>

            <Skeleton className="h-12 w-full rounded-xl mt-6" />
          </div>

          <Skeleton className="h-4 w-4/5 mx-auto mt-10" />
        </div>
      </section>
    </main>
  );
}
