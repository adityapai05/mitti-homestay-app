import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function HostStartLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-52">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Skeleton className="h-12 w-5/6" />
            <Skeleton className="h-5 w-3/4" />
            <div className="mt-10 space-y-7">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center items-center lg:justify-end">
            <div className="w-full max-w-md bg-mitti-cream border border-mitti-khaki rounded-3xl p-8 space-y-4">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-12 w-full rounded-xl mt-7" />
              <Skeleton className="h-4 w-2/3 mx-auto mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
