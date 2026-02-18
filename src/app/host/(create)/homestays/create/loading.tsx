import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function CreateHomestayLoading() {
  return (
    <div className="min-h-screen bg-mitti-beige flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 pb-32">
        <div className="w-full max-w-5xl space-y-6">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-[100] bg-mitti-cream border-t border-mitti-khaki">
        <Skeleton className="h-1 w-full rounded-none" />
        <div className="px-4 sm:px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
