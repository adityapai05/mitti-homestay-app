export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-3">
        <div className="h-6 w-40 rounded bg-mitti-beige" />
        <div className="h-5 w-64 rounded bg-mitti-beige" />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest snapshot */}
          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <div className="h-4 w-32 rounded bg-mitti-beige" />
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-mitti-beige" />
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-mitti-beige" />
                <div className="h-3 w-28 rounded bg-mitti-beige" />
              </div>
            </div>
          </div>

          {/* Stay details */}
          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <div className="h-4 w-32 rounded bg-mitti-beige" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 w-full rounded bg-mitti-beige" />
              <div className="h-4 w-full rounded bg-mitti-beige" />
              <div className="h-4 w-full rounded bg-mitti-beige" />
              <div className="h-4 w-full rounded bg-mitti-beige" />
            </div>
          </div>

          {/* Homestay snapshot */}
          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <div className="h-4 w-40 rounded bg-mitti-beige" />
            <div className="h-40 w-full rounded-lg bg-mitti-beige" />
            <div className="h-4 w-48 rounded bg-mitti-beige" />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Price breakdown */}
          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <div className="h-4 w-32 rounded bg-mitti-beige" />
            <div className="h-4 w-full rounded bg-mitti-beige" />
            <div className="h-4 w-full rounded bg-mitti-beige" />
            <div className="h-6 w-full rounded bg-mitti-beige" />
          </div>

          {/* Action zone */}
          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <div className="h-4 w-28 rounded bg-mitti-beige" />
            <div className="h-10 w-full rounded bg-mitti-beige" />
          </div>
        </div>
      </div>
    </div>
  );
}
