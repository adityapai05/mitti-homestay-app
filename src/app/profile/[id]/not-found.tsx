import { UserX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="text-center py-24 space-y-4">
      <div className="flex justify-center text-mitti-khaki">
        <UserX size={40} />
      </div>
      <h1 className="text-2xl font-semibold text-mitti-dark-brown">
        Profile not found
      </h1>
      <p className="text-mitti-dark-brown/70 max-w-md mx-auto">
        This profile may not exist, has been deactivated, or is no longer
        publicly available.
      </p>
    </div>
  );
}
