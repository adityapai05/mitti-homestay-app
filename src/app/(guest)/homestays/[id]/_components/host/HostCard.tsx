import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Star, Languages, Info, ArrowUpRight } from "lucide-react";
import { HomestayDetailsDTO } from "../../types";

type Host = HomestayDetailsDTO["host"];

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center space-y-0.5 min-w-[72px]">
      <div className="text-lg font-semibold text-mitti-dark-brown">{value}</div>
      <div className="text-xs text-mitti-dark-brown">{label}</div>
    </div>
  );
}

export default function HostCard({ host }: { host: Host }) {
  return (
    <div
      className="relative rounded-2xl border border-mitti-khaki bg-mitti-beige p-6
                 transition  hover:border-mitti-olive/40"
    >
      {/* View profile action */}
      <Link
        href={`/profile/${host.id}`}
        target="_blank"
        className="absolute right-4 top-4 rounded-full p-2 text-mitti-dark-brown/60
                   hover:bg-mitti-khaki hover:text-mitti-dark-brown
                   focus:outline-none focus:ring-2 focus:ring-mitti-olive"
        aria-label="View host profile"
        title="View public profile"
      >
        <ArrowUpRight className="h-4 w-4" />
      </Link>

      <div className="flex flex-col md:flex-row gap-6 md:gap-16">
        {/* LEFT: Identity + stats */}
        <div className="space-y-4 md:w-[280px]">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-mitti-khaki">
              {host.image ? (
                <Image
                  src={host.image}
                  alt={host.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-mitti-dark-brown">
                  {host.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <p className="text-lg font-semibold text-mitti-dark-brown">
                {host.name}
              </p>

              {host.isUserVerified && (
                <div className="flex items-center gap-1 text-sm text-mitti-olive">
                  <ShieldCheck className="h-4 w-4" />
                  Verified Host
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6">
            <Stat
              value={host.stats.reviewCount}
              label={host.stats.reviewCount === 1 ? "Review" : "Reviews"}
            />

            <Stat
              value={
                host.stats.averageRating ? (
                  <span className="inline-flex items-center gap-1">
                    {host.stats.averageRating}
                    <Star className="h-4 w-4 text-mitti-olive fill-mitti-olive" />
                  </span>
                ) : (
                  "—"
                )
              }
              label="Rating"
            />

            <Stat value={host.stats.hostingSince} label="Hosting Since" />
          </div>
        </div>

        {/* RIGHT: About + languages */}
        <div className="flex-1 space-y-4 md:space-y-8">
          {host.about && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-mitti-dark-brown flex items-center gap-2">
                <Info size={14} />
                About
              </h3>
              <p className="text-sm text-mitti-dark-brown/80 leading-relaxed">
                {host.about}
              </p>
            </div>
          )}

          {host.languages.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-mitti-dark-brown flex items-center gap-2">
                <Languages size={14} />
                Languages Spoken
              </h3>

              <div className="flex flex-wrap gap-2">
                {host.languages.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full bg-mitti-khaki/40 px-3 py-1 text-xs text-mitti-dark-brown"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-mitti-khaki flex items-start gap-2">
        <ShieldCheck className="h-4 w-4 text-mitti-olive mt-0.5 shrink-0" />

        <p className="text-xs text-mitti-dark-brown/70 leading-relaxed">
          Payments are secured by MITTI. Funds are released to the host only
          after a successful stay, with cancellations and refunds handled
          according to{" "}
          <Link
            href="/cancellation-policy"
            className="font-medium text-mitti-olive underline underline-offset-2 hover:text-mitti-dark-brown"
          >
            policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
