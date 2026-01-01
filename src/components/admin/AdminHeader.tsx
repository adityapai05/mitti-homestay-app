import { ServerUser } from "@/types";

export default function AdminHeader({ admin }: { admin: ServerUser }) {
  return (
    <header className="h-14 border-b border-mitti-khaki bg-mitti-cream flex items-center justify-between px-6">
      <div>
        <p className="text-sm font-medium text-mitti-dark-brown">
          Admin Dashboard
        </p>
        <p className="text-xs text-mitti-dark-brown/70">
          Secure administrative access
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-mitti-dark-brown">
            {admin.name}
          </p>
          <p className="text-xs text-mitti-dark-brown/70">Administrator</p>
        </div>

        <div className="h-9 w-9 rounded-full bg-mitti-khaki flex items-center justify-center text-sm font-semibold text-mitti-dark-brown">
          {admin.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
