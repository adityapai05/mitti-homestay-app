export default function LoadingMyStays() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-28 rounded-xl border border-mitti-khaki bg-white animate-pulse"
        />
      ))}
    </div>
  );
}
