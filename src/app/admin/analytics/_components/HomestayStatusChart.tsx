"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/prebuilt-components/chart";
import { Card } from "@/components/ui/prebuilt-components/card";

type HomestayStatusPoint = {
  status: "Verified" | "Pending" | "Rejected";
  count: number;
};

const chartConfig = {
  Verified: { label: "Verified", color: "#6B8E23" },
  Pending: { label: "Pending", color: "#D2B48C" },
  Rejected: { label: "Rejected", color: "#8B4513" },
} satisfies ChartConfig;

export default function HomestayStatusChart({
  data,
}: {
  data: HomestayStatusPoint[];
}) {
  const hasData = data.some((d) => d.count > 0);

  return (
    <Card className="p-6 border border-mitti-dark-brown/10 bg-white">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Homestay Status Distribution
        </h2>
        <p className="text-sm text-mitti-dark-brown/60">
          Verification status of homestays
        </p>
      </div>

      {!hasData ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-mitti-dark-brown/50">
          No homestays available yet
        </div>
      ) : (
        <>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="status" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value} homestays`}
                  />
                }
              />
              <Bar dataKey="count" radius={4} fill="var(--color-Verified)" />
            </BarChart>
          </ChartContainer>

          <div className="mt-3 flex gap-4 text-xs text-mitti-dark-brown/60">
            <span>Verified, pending, and rejected listings</span>
          </div>
        </>
      )}
    </Card>
  );
}
