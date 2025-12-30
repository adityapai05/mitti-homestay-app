export default function HostBookingsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-2xl border border-mitti-khaki bg-white p-4 animate-pulse"
        >
          <div className="h-28 w-36 rounded-xl bg-mitti-khaki/40" />

          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/3 bg-mitti-khaki/40 rounded" />
            <div className="h-3 w-2/3 bg-mitti-khaki/30 rounded" />
            <div className="h-4 w-1/2 bg-mitti-khaki/40 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
