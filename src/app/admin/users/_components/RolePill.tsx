export default function RolePill({ role }: { role: string }) {
  return (
    <span className="px-2 py-1 rounded text-xs font-medium bg-mitti-khaki text-mitti-dark-brown">
      {role}
    </span>
  );
}
