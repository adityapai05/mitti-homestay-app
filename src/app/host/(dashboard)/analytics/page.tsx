import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/requireRole";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import HostKpiCard from "./_components/HostKpiCard";
import EarningsOverTimeChart from "./_components/EarningsOverTimeChart";
import BookingsTrendChart from "./_components/BookingsTrendChart";
import BookingStatusChart from "./_components/BookingStatusChart";
import BookingsPerHomestayChart from "./_components/BookingsPerHomestayChart";
import { BookingStatus } from "@prisma/client";

/* ---------- Types ---------- */
type MonthlyRevenueRow = {
  month: string;
  revenue: number;
};

type MonthlyCountRow = {
  month: string;
  count: number;
};

type StatusCountRow = {
  status: BookingStatus;
  count: number;
};

type HomestayBookingsRow = {
  name: string;
  count: number;
};

export default async function HostAnalyticsPage() {
  await requireRole("HOST");

  const user = await getCurrentUser();
  if (!user) return null;

  const hostId = user.id;

  /* ---------- KPIs ---------- */
  const totalBookings = await prisma.booking.count({
    where: { homestay: { ownerId: hostId } },
  });

  const earningsAgg = await prisma.booking.aggregate({
    where: {
      homestay: { ownerId: hostId },
      status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
    },
    _sum: { totalPrice: true },
  });

  const activeHomestays = await prisma.homestay.count({
    where: { ownerId: hostId, isVerified: true },
  });

  const ratingsAgg = await prisma.review.aggregate({
    where: { homestay: { ownerId: hostId } },
    _avg: { rating: true },
  });

  const totalEarnings = earningsAgg._sum.totalPrice ?? 0;
  const avgRating =
    ratingsAgg._avg.rating !== null ? ratingsAgg._avg.rating.toFixed(1) : "0.0";

  /* ---------- Analytics ---------- */
  const earningsOverTime = await prisma.$queryRaw<MonthlyRevenueRow[]>`
    SELECT
      TO_CHAR(DATE_TRUNC('month', b."createdAt"), 'YYYY-MM') AS month,
      COALESCE(SUM(b."totalPrice"), 0)::float AS revenue
    FROM "Booking" b
    JOIN "Homestay" h ON b."homestayId" = h.id
    WHERE h."ownerId" = ${hostId}
      AND b.status = 'COMPLETED'
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  const bookingsOverTime = await prisma.$queryRaw<MonthlyCountRow[]>`
    SELECT
      TO_CHAR(DATE_TRUNC('month', b."createdAt"), 'YYYY-MM') AS month,
      COUNT(*)::int AS count
    FROM "Booking" b
    JOIN "Homestay" h ON b."homestayId" = h.id
    WHERE h."ownerId" = ${hostId}
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  const bookingStatusBreakdown = await prisma.$queryRaw<StatusCountRow[]>`
    SELECT b.status, COUNT(*)::int AS count
    FROM "Booking" b
    JOIN "Homestay" h ON b."homestayId" = h.id
    WHERE h."ownerId" = ${hostId}
    GROUP BY b.status
  `;

  const bookingsPerHomestay = await prisma.$queryRaw<HomestayBookingsRow[]>`
    SELECT
      h.name,
      COUNT(b.id)::int AS count
    FROM "Homestay" h
    LEFT JOIN "Booking" b ON b."homestayId" = h.id
    WHERE h."ownerId" = ${hostId}
    GROUP BY h.name
    ORDER BY count DESC
  `;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Analytics
          </h1>
          <p className="text-sm text-mitti-dark-brown/80">
            Track your bookings, earnings, and homestay performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <HostKpiCard label="Total bookings" value={totalBookings} />
          <HostKpiCard
            label="Total earnings"
            value={`₹${Number(totalEarnings).toLocaleString("en-IN")}`}
          />
          <HostKpiCard label="Active homestays" value={activeHomestays} />
          <HostKpiCard label="Average rating" value={avgRating} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EarningsOverTimeChart data={earningsOverTime} />
          <BookingsTrendChart data={bookingsOverTime} />
          <BookingStatusChart data={bookingStatusBreakdown} />
          <BookingsPerHomestayChart data={bookingsPerHomestay} />
        </div>
      </div>
    </div>
  );
}
