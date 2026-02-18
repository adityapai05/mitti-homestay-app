import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function SettingsAccountLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-44" />
      <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-72" />
    </div>
  );
}
