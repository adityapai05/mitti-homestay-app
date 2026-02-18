import Image from "next/image";
import { Plus, ShieldCheck, Clock } from "lucide-react";
import { getHostHomestays } from "@/lib/server/host/getHostHomestays";
import SmartLink from "@/components/shared/SmartLink";

export const dynamic = "force-dynamic";

const HostHomestaysPage = async () => {
  const homestays = await getHostHomestays();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige px-4 sm:px-6 py-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
              Your homestays
            </h1>
            <p className="mt-1 text-sm text-mitti-dark-brown/80">
              Manage and track the homestays you&apos;ve listed on MITTI.
            </p>
          </div>

          <SmartLink
            href="/host/homestays/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-mitti-brown text-white font-medium hover:bg-mitti-brown/90 cursor-pointer"
          >
            <Plus size={18} />
            Create homestay
          </SmartLink>
        </div>

        {/* Empty state */}
        {homestays.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center bg-mitti-cream border border-mitti-khaki rounded-2xl p-10">
            <h2 className="text-xl font-semibold text-mitti-dark-brown">
              You haven&apos;t listed any homestays yet
            </h2>
            <p className="mt-2 text-sm text-mitti-dark-brown/80 max-w-md">
              Create your first homestay to start hosting guests and accepting
              bookings on MITTI.
            </p>

            <SmartLink
              href="/host/homestays/create"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-mitti-brown text-white font-medium hover:bg-mitti-brown/90 cursor-pointer"
            >
              <Plus size={18} />
              Create your first homestay
            </SmartLink>
          </div>
        )}

        {/* Homestay grid */}
        {homestays.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homestays.map((stay) => {
              const coverImage = stay.imageUrl?.[0] || "/mitti-placeholder.jpg";

              const location =
                [stay.village, stay.state].filter(Boolean).join(", ") ||
                "Location not set";

              return (
                <SmartLink
                  key={stay.id}
                  href={`/host/homestays/${stay.id}`}
                  className="group bg-white border border-mitti-khaki rounded-2xl overflow-hidden shadow-sm
                             hover:shadow-md hover:-translate-y-[2px]
                             transition-all cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-44 w-full">
                    <Image
                      src={coverImage}
                      alt={stay.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold text-mitti-dark-brown">
                      {stay.name}
                    </h3>

                    <p className="text-xs text-mitti-dark-brown/70 line-clamp-1">
                      {location}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-base font-semibold text-mitti-dark-brown">
                        &#8377;{Number(stay.pricePerNight).toLocaleString()}{" "}
                        <span className="font-normal text-mitti-dark-brown/70">
                          / night
                        </span>
                      </p>

                      {stay.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-mitti-olive text-white">
                          <ShieldCheck size={14} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-mitti-khaki text-mitti-dark-brown">
                          <Clock size={14} />
                          Pending
                        </span>
                      )}
                    </div>

                    <p className="text-xs mt-1 text-mitti-dark-brown/70">
                      {stay.isVerified
                        ? "Guests can book this homestay"
                        : "Not bookable until verified"}
                    </p>
                  </div>
                </SmartLink>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostHomestaysPage;
