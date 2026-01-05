"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/prebuilt-components/chart";
import { Card } from "@/components/ui/prebuilt-components/card";

type HomestayBookingsPoint = {
  name: string;
  count: number;
};

const chartConfig = {
  count: {
    label: "Bookings",
    color: "#6A3410",
  },
} satisfies ChartConfig;

export default function BookingsPerHomestayChart({
  data,
}: {
  data: HomestayBookingsPoint[];
}) {
  const hasData = data.some((d) => d.count > 0);

  return (
    <Card className="p-6 border border-mitti-khaki bg-white">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Bookings per homestay
        </h2>
        <p className="text-sm text-mitti-dark-brown/60">
          Compare performance across your listings
        </p>
      </div>

      {!hasData ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-mitti-dark-brown/50">
          No bookings yet
        </div>
      ) : (
        <>
          <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value} bookings`}
                  />
                }
              />
              <Bar dataKey="count" fill="#6A3410" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>

          <div className="mt-3 text-xs text-mitti-dark-brown/60">
            Number of confirmed and completed bookings per homestay
          </div>
        </>
      )}
    </Card>
  );
}
