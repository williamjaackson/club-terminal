"use client";

import dynamic from "next/dynamic";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface MembershipChartProps {
  data: Array<{
    date: string;
    members: number;
  }>;
}

export function MembershipChart({ data }: MembershipChartProps) {
  return (
    <ChartContainer
      config={{
        label: { label: "Membership Growth" },
        color: { color: "#ff0000" },
      }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{ value: "Date", position: "bottom" }}
            tickFormatter={(date) => {
              const d = new Date(date);
              return d.getDate() === 1
                ? d.toLocaleString("default", { month: "short" })
                : "";
            }}
            interval={0}
          />
          <YAxis
            label={{ value: "Total Members", angle: -90, position: "left" }}
            domain={[0, "dataMax"]}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="members"
            stroke="#ff0000"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
