"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/prebuilt-components/chart";
import { Card } from "@/components/ui/prebuilt-components/card";

type EarningsPoint = {
  month: string;
  revenue: number;
};

const chartConfig = {
  revenue: {
    label: "Earnings",
    color: "#6B8E23",
  },
} satisfies ChartConfig;

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EarningsOverTimeChart({
  data,
}: {
  data: EarningsPoint[];
}) {
  const hasData = data.some((d) => d.revenue > 0);

  return (
    <Card className="p-6 border border-mitti-khaki bg-white">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Earnings over time
        </h2>
        <p className="text-sm text-mitti-dark-brown/60">
          Monthly earnings from completed bookings
        </p>
      </div>

      {!hasData ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-mitti-dark-brown/50">
          No completed bookings yet
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <AreaChart accessibilityLayer data={data}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6B8E23" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6B8E23" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={formatMonth}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6B8E23"
              strokeWidth={2}
              fill="url(#earningsGradient)"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </Card>
  );
}
