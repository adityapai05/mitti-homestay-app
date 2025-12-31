import Image from "next/image";
import Link from "next/link";
import { Pencil, BadgeCheck, User } from "lucide-react";

type ProfileUser = {
  id: string;
  name: string;
  image: string | null;
  role: "USER" | "HOST" | "ADMIN";
};

export type HostData = {
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
  hostingSince: number;
  homestaysCount: number;
  guestsHosted: number;
  averageRating: number | null;
} | null;

interface Props {
  user: ProfileUser;
  hostData: HostData;
  isSelf: boolean;
}

export default function ProfileHeader({ user, hostData, isSelf }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <div className="relative h-28 w-28 rounded-full overflow-hidden border border-mitti-khaki bg-mitti-beige">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-mitti-brown">
            {user.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="space-y-3 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold text-mitti-dark-brown flex items-center gap-2">
            <User size={20} />
            {user.name}
          </h1>

          {isSelf && (
            <Link
              href="/settings/profile"
              className="flex items-center gap-1 text-sm text-mitti-olive hover:underline"
            >
              <Pencil size={14} />
              Edit profile
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {user.role === "HOST" && (
            <span className="rounded-full bg-mitti-olive/10 px-3 py-1 text-mitti-olive">
              Host
            </span>
          )}

          {hostData?.verificationStatus === "VERIFIED" && (
            <span className="flex items-center gap-1 rounded-full bg-mitti-olive/20 px-3 py-1 text-mitti-olive">
              <BadgeCheck size={14} />
              Verified host
            </span>
          )}

          {hostData?.verificationStatus === "PENDING" && (
            <span className="rounded-full bg-mitti-khaki/40 px-3 py-1 text-mitti-dark-brown">
              Verification pending
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
