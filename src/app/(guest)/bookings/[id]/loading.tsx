export default function BookingLoading() {
  return (
    <main className="bg-mitti-beige min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status header */}
            <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-3">
              <div className="h-6 w-40 rounded-full bg-mitti-khaki/60" />
              <div className="h-5 w-3/4 rounded bg-mitti-khaki/40" />
              <div className="h-4 w-full rounded bg-mitti-khaki/30" />
            </div>

            {/* Homestay snapshot */}
            <div className="rounded-xl border border-mitti-khaki bg-white p-4">
              <div className="flex gap-4 items-center">
                <div className="h-20 w-20 rounded-lg bg-mitti-khaki/40" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-mitti-khaki/40" />
                  <div className="h-3 w-1/2 rounded bg-mitti-khaki/30" />
                </div>
              </div>
            </div>

            {/* Booking details */}
            <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
              <div className="h-4 w-32 rounded bg-mitti-khaki/40" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 rounded bg-mitti-khaki/30" />
                <div className="h-10 rounded bg-mitti-khaki/30" />
                <div className="h-10 rounded bg-mitti-khaki/30" />
                <div className="h-10 rounded bg-mitti-khaki/30" />
              </div>
            </div>

            {/* Next steps */}
            <div className="rounded-xl border border-mitti-khaki bg-mitti-cream p-5 space-y-3">
              <div className="h-4 w-28 rounded bg-mitti-khaki/40" />
              <div className="h-4 w-full rounded bg-mitti-khaki/30" />
              <div className="h-10 w-full rounded bg-mitti-khaki/50" />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
              <div className="h-4 w-32 rounded bg-mitti-khaki/40" />
              <div className="h-4 w-full rounded bg-mitti-khaki/30" />
              <div className="h-4 w-full rounded bg-mitti-khaki/30" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
