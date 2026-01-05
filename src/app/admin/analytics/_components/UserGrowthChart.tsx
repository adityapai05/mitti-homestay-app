"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/prebuilt-components/chart";
import { Card } from "@/components/ui/prebuilt-components/card";

type UserGrowthPoint = {
  month: string;
  count: number;
};

const chartConfig = {
  count: {
    label: "Users",
    color: "#6B8E23",
  },
} satisfies ChartConfig;

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export default function UserGrowthChart({ data }: { data: UserGrowthPoint[] }) {
  const hasData = data.length > 0;

  return (
    <Card className="p-6 border border-mitti-dark-brown/10 bg-white">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          User Growth Over Time
        </h2>
        <p className="text-sm text-mitti-dark-brown/60">
          New users joining the platform each month
        </p>
      </div>

      {!hasData ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-mitti-dark-brown/50">
          No user data available yet
        </div>
      ) : (
        <>
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
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={formatMonth}
                    formatter={(value) => `${value} new users registered`}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6B8E23"
                strokeWidth={2}
                dot={{ r: 3, fill: "#6B8E23" }}
                activeDot={{ r: 5, fill: "#556B2F" }}
              />
            </LineChart>
          </ChartContainer>

          {/* Soft legend */}
          <div className="mt-3 text-xs text-mitti-dark-brown/60 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#6B8E23]" />
            Monthly user registrations
          </div>
        </>
      )}
    </Card>
  );
}
