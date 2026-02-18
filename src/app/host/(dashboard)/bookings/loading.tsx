import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";
import HostBookingsLoading from "../../_components/HostBookingsLoading";

export default function HostBookingsPageLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige px-4 sm:px-6 py-2">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-2 mb-4">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="mb-6 flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>

        <HostBookingsLoading />
      </div>
    </div>
  );
}
