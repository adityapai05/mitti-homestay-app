import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

function AboutSubpageLoading() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-6 py-16 flex justify-center">
        <div className="max-w-4xl w-full">
          <div className="mb-10 text-center space-y-4">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-10 w-3/4 mx-auto" />
          </div>

          <div className="space-y-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-11/12" />
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-mitti-dark-brown/20 space-y-6">
            <Skeleton className="h-4 w-40 mx-auto" />
            <div className="flex justify-center gap-10">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutSubpageLoading;
