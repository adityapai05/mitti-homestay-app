"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/prebuilt-components/chart";
import { Card } from "@/components/ui/prebuilt-components/card";
import { BookingStatus } from "@prisma/client";

type StatusPoint = {
  status: BookingStatus;
  count: number;
};

type ChartDatum = {
  status: BookingStatus;
  label: string;
  count: number;
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING_HOST_APPROVAL: "Pending approval",
  AWAITING_PAYMENT: "Awaiting payment",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING_HOST_APPROVAL: "#D2B48C",
  AWAITING_PAYMENT: "#BDB76B",
  CONFIRMED: "#6B8E23",
  CANCELLED: "#A0522D",
  COMPLETED: "#8B4513",
};

const chartConfig: ChartConfig = {
  count: {
    label: "Bookings",
  },
};

export default function BookingStatusChart({ data }: { data: StatusPoint[] }) {
  const hasData = data.length > 0;

  const chartData: ChartDatum[] = data.map((item) => ({
    status: item.status,
    label: STATUS_LABELS[item.status],
    count: item.count,
  }));

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
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <PieChart accessibilityLayer>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="label"
                  formatter={(value) => `${value} bookings`}
                />
              }
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
      )}
    </Card>
  );
}
