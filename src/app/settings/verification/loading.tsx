import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function SettingsVerificationLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />

      <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      <Skeleton className="h-4 w-80" />
    </div>
  );
}
