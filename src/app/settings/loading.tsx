import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function SettingsRootLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-44" />
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
