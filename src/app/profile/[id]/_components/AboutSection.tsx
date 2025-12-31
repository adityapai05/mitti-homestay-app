import { Info } from "lucide-react";
import Link from "next/link";

interface Props {
  about: string | null;
  isSelf: boolean;
  role: "USER" | "HOST" | "ADMIN";
}

export default function AboutSection({ about, isSelf, role }: Props) {
  if (!about && !isSelf) return null;

  const emptyCopy =
    role === "HOST"
      ? "Tell guests a little about yourself and your hosting journey."
      : "Tell people a little about yourself.";

  return (
    <div className="space-y-3 max-w-3xl">
      <h2 className="text-xl font-semibold text-mitti-dark-brown flex items-center gap-2">
        <Info size={18} />
        About
      </h2>

      {about ? (
        <p className="leading-relaxed text-mitti-dark-brown/90">{about}</p>
      ) : (
        <p className="text-mitti-dark-brown/60 italic">
          {emptyCopy}
          <Link
            href="/settings/profile"
            className="block mt-1 text-sm not-italic text-mitti-olive hover:underline"
          >
            Add an introduction
          </Link>
        </p>
      )}
    </div>
  );
}
