"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  return date.toLocaleString("en-US", {
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
          Revenue from completed bookings only
        </p>
      </div>

      {!hasData ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-mitti-dark-brown/50">
          No completed bookings yet
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart accessibilityLayer data={data}>
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
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#556B2F"
              strokeWidth={2}
              dot={{ r: 3, fill: "#556B2F" }}
              activeDot={{ r: 5, fill: "#3E4F1C" }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </Card>
  );
}
