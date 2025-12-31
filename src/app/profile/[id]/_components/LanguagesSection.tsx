import { Languages } from "lucide-react";
import Link from "next/link";

interface Props {
  languages?: string[] | null;
  isSelf: boolean;
  role: "USER" | "HOST" | "ADMIN";
}

export default function LanguagesSection({ languages, isSelf, role }: Props) {
  const safeLanguages = languages ?? [];

  if (safeLanguages.length === 0 && !isSelf) return null;

  const emptyCopy =
    role === "HOST"
      ? "Guests often appreciate knowing what languages you speak."
      : "Let people know which languages you’re comfortable with.";

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-mitti-dark-brown flex items-center gap-2">
        <Languages size={18} />
        Languages spoken
      </h2>

      {safeLanguages.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {safeLanguages.map((lang) => (
            <span
              key={lang}
              className="rounded-full bg-mitti-khaki/40 px-4 py-1 text-sm text-mitti-dark-brown"
            >
              {lang}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-mitti-dark-brown/60 italic">
          {emptyCopy}
          <Link
            href="/settings/profile"
            className="block mt-1 text-sm not-italic text-mitti-olive hover:underline"
          >
            Add languages
          </Link>
        </p>
      )}
    </div>
  );
}
