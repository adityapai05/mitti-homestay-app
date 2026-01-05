"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/prebuilt-components/chart";
import { Card } from "@/components/ui/prebuilt-components/card";

type StateCountPoint = {
  state: string;
  count: number;
};

const chartConfig = {
  count: {
    label: "Homestays",
    color: "#8B4513",
  },
} satisfies ChartConfig;

export default function TopStatesChart({ data }: { data: StateCountPoint[] }) {
  const hasData = data.length > 0;

  return (
    <Card className="p-6 border border-mitti-dark-brown/10 bg-white">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Top States by Homestays
        </h2>
        <p className="text-sm text-mitti-dark-brown/60">
          States with the highest number of homestays
        </p>
      </div>

      {!hasData ? (
        <div className="h-[220px] flex items-center justify-center text-sm text-mitti-dark-brown/50">
          No location data available yet
        </div>
      ) : (
        <>
          <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
            <BarChart accessibilityLayer data={data} layout="vertical">
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="state"
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value} homestays listed`}
                  />
                }
              />
              <Bar dataKey="count" radius={4} fill="var(--color-count)" />
            </BarChart>
          </ChartContainer>

          <div className="mt-3 text-xs text-mitti-dark-brown/60">
            Geographic concentration of listings
          </div>
        </>
      )}
    </Card>
  );
}
