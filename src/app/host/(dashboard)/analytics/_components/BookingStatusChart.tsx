"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/prebuilt-components/chart";
import { Card } from "@/components/ui/prebuilt-components/card";
import { BookingStatus } from "@prisma/client";

/* ---------- Types ---------- */
type StatusPoint = {
  status: BookingStatus;
  count: number;
};

type ChartDatum = {
  status: BookingStatus;
  label: string;
  count: number;
};

/* ---------- Status Metadata ---------- */
const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING_HOST_APPROVAL: "Pending approval",
  AWAITING_PAYMENT: "Awaiting payment",
  CONFIRMED: "Confirmed",
  CANCELLED_BY_GUEST: "Cancelled by guest",
  CANCELLED_BY_HOST: "Cancelled by host",
  COMPLETED: "Completed",
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING_HOST_APPROVAL: "#D2B48C",
  AWAITING_PAYMENT: "#BDB76B",
  CONFIRMED: "#6B8E23",
  CANCELLED_BY_GUEST: "#A0522D",
  CANCELLED_BY_HOST: "#8B0000",
  COMPLETED: "#8B4513",
};

const chartConfig: ChartConfig = {
  count: {
    label: "Bookings",
  },
};

export default function BookingStatusChart({ data }: { data: StatusPoint[] }) {
  const hasData = data.some((d) => d.count > 0);

  const chartData: ChartDatum[] = data.map((item) => ({
    status: item.status,
    label: STATUS_LABELS[item.status],
    count: item.count,
  }));

  const total = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="p-6 border border-mitti-khaki bg-white">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Booking status breakdown
        </h2>
        <p className="text-sm text-mitti-dark-brown/60">
          Distribution of bookings by lifecycle stage
        </p>
      </div>

      {!hasData ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-mitti-dark-brown/50">
          No bookings yet
        </div>
      ) : (
        <>
          {/* ---------- Chart ---------- */}
          <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const d = payload[0].payload as ChartDatum;
                  const percent =
                    total > 0 ? Math.round((d.count / total) * 100) : 0;

                  return (
                    <div className="rounded-md bg-white px-3 py-2 text-xs shadow border border-mitti-dark-brown/10">
                      <div className="font-medium text-mitti-dark-brown">
                        {d.label}
                      </div>
                      <div className="text-mitti-dark-brown/70">
                        {d.count} bookings · {percent}%
                      </div>
                    </div>
                  );
                }}
              />

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="label"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* ---------- Legend ---------- */}
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {chartData.map((d) => (
              <div
                key={d.status}
                className="flex items-center gap-2 text-mitti-dark-brown/70"
              >
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: STATUS_COLORS[d.status] }}
                />
                <span className="flex-1">{d.label}</span>
                <span className="tabular-nums">{d.count}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
