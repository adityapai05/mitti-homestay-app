import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

function PolicyLoading() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="max-w-4xl w-full">
          <div className="mb-10 text-center space-y-4">
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-10 w-2/3 mx-auto" />
          </div>

          <div className="space-y-6 px-4 sm:px-0">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default PolicyLoading;
