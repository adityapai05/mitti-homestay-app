"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/prebuilt-components/chart";
import { Card } from "@/components/ui/prebuilt-components/card";

type BookingsPoint = {
  month: string;
  count: number;
};

const chartConfig = {
  count: {
    label: "Bookings",
    color: "var(--chart-2)",
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

export default function BookingsOverTimeChart({
  data,
}: {
  data: BookingsPoint[];
}) {
  const hasData = data.length > 0;

  return (
    <Card className="p-6 border border-mitti-dark-brown/10 bg-white">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Bookings Over Time
        </h2>
        <p className="text-sm text-mitti-dark-brown/60">
          Monthly booking activity on the platform
        </p>
      </div>

      {!hasData ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-mitti-dark-brown/50">
          No booking data available yet
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
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              content={<ChartTooltipContent labelFormatter={formatMonth} />}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8B4513"
              strokeWidth={2}
              dot={{ r: 3, fill: "#8B4513" }}
              activeDot={{ r: 5, fill: "#6A3410" }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </Card>
  );
}
