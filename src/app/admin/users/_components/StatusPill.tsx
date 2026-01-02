export default function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {active ? "Active" : "Disabled"}
    </span>
  );
}
