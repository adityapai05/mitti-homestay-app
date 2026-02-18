import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function HostHomestayEditorLoading() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-mitti-beige">
      <aside className="hidden lg:flex w-72 border-r border-mitti-khaki bg-mitti-cream p-4 flex-col gap-4">
        <Skeleton className="h-8 w-3/4" />
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-lg" />
        ))}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-mitti-khaki px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
        </main>
      </div>
    </div>
  );
}
