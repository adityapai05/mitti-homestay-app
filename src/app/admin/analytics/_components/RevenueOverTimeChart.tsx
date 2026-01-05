"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/prebuilt-components/chart";
import { Card } from "@/components/ui/prebuilt-components/card";

type RevenuePoint = {
  month: string;
  revenue: number;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#556B2F",
  },
} satisfies ChartConfig;

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function formatCurrency(value: number) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function RevenueOverTimeChart({
  data,
}: {
  data: RevenuePoint[];
}) {
  const hasData = data.some((d) => d.revenue > 0);

  return (
    <Card className="p-6 border border-mitti-dark-brown/10 bg-white">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Revenue Over Time
        </h2>
        <p className="text-sm text-mitti-dark-brown/60">
          Earnings from completed bookings
        </p>
      </div>

      {!hasData ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-mitti-dark-brown/50">
          No completed bookings yet
        </div>
      ) : (
        <>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <AreaChart accessibilityLayer data={data}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#556B2F" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#556B2F" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={formatMonth}
                    formatter={(value) =>
                      `${formatCurrency(Number(value))} earned`
                    }
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#556B2F"
                fill="url(#revGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>

          <div className="mt-3 text-xs text-mitti-dark-brown/60 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#556B2F]" />
            Revenue from completed bookings
          </div>
        </>
      )}
    </Card>
  );
}
