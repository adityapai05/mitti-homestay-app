import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/requireRole";
import UserGrowthChart from "./_components/UserGrowthChart";
import BookingsOverTimeChart from "./_components/BookingsOverTimeChart";
import HomestayStatusChart from "./_components/HomestayStatusChart";
import RevenueOverTimeChart from "./_components/RevenueOverTimeChart";
import TopStatesChart from "./_components/TopStatesChart";

type MonthlyCountRow = {
  month: string;
  count: number;
};

type MonthlyRevenueRow = {
  month: string;
  revenue: number;
};

type HomestayStatusPoint = {
  status: "Verified" | "Pending" | "Rejected";
  count: number;
};

type StateCountPoint = {
  state: string;
  count: number;
};

export default async function AdminAnalyticsPage() {
  await requireRole("ADMIN");

  const userGrowth = await prisma.$queryRaw<MonthlyCountRow[]>`
    SELECT
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
      COUNT(*)::int AS count
    FROM "User"
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  const bookingsOverTime = await prisma.$queryRaw<MonthlyCountRow[]>`
    SELECT
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
      COUNT(*)::int AS count
    FROM "Booking"
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  const revenueOverTime = await prisma.$queryRaw<MonthlyRevenueRow[]>`
    SELECT
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
      COALESCE(SUM("totalPrice"), 0)::float AS revenue
    FROM "Booking"
    WHERE status = 'COMPLETED'
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  const homestays = await prisma.homestay.findMany({
    select: { isVerified: true, rejectionReason: true, state: true },
  });

  const homestayStatusData: HomestayStatusPoint[] = [
    {
      status: "Verified",
      count: homestays.filter((h) => h.isVerified).length,
    },
    {
      status: "Pending",
      count: homestays.filter(
        (h) => !h.isVerified && h.rejectionReason === null
      ).length,
    },
    {
      status: "Rejected",
      count: homestays.filter((h) => h.rejectionReason !== null).length,
    },
  ];

  const stateMap = new Map<string, number>();
  homestays.forEach((h) => {
    if (!h.state) return;
    stateMap.set(h.state, (stateMap.get(h.state) ?? 0) + 1);
  });

  const topStatesData: StateCountPoint[] = Array.from(stateMap.entries())
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">
          Platform Analytics
        </h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Read-only insights across users, homestays, bookings, and revenue
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart data={userGrowth} />
        <BookingsOverTimeChart data={bookingsOverTime} />
        <RevenueOverTimeChart data={revenueOverTime} />
        <HomestayStatusChart data={homestayStatusData} />

        <div className="lg:col-span-2 mb-10">
          <TopStatesChart data={topStatesData} />
        </div>
      </div>
    </div>
  );
}
