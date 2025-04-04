"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";

interface DefectAreaChartProps {
  data: {
    id: string;
    area: string;
    count: number;
    fullPath: string;
  }[];
}

export default function DefectAreaChart({ data }: DefectAreaChartProps) {
  const [detailLevel, setDetailLevel] = useState<"top" | "mid" | "full">("top");

  // Process data based on detail level
  const processedData = processDataByDetailLevel(data, detailLevel);

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 text-black-300 mt-2">
        <Button
          onClick={() => setDetailLevel("top")}
          variant={detailLevel === "top" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
        >
          상위 카테고리
        </Button>
        <Button
          onClick={() => setDetailLevel("mid")}
          variant={detailLevel === "mid" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
        >
          중위 카테고리
        </Button>
        <Button
          onClick={() => setDetailLevel("full")}
          variant={detailLevel === "full" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
        >
          전체 상세
        </Button>
      </div>

      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: detailLevel === "full" ? 100 : 60,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#555"
              vertical={false}
            />
            <XAxis
              dataKey="displayName"
              tick={{
                fill: "#fff",
                //angle: detailLevel === "full" ? -45 : 0,
                textAnchor: detailLevel === "full" ? "end" : "middle",
                fontSize: 12,
                dy: detailLevel === "full" ? 10 : 0,
              }}
              axisLine={{ stroke: "#777" }}
              tickLine={{ stroke: "#777" }}
              height={detailLevel === "full" ? 100 : 60}
              interval={0}
            />
            <YAxis
              tick={{ fill: "#fff" }}
              axisLine={{ stroke: "#777" }}
              tickLine={{ stroke: "#777" }}
              domain={[0, "auto"]}
              allowDecimals={false}
              label={{
                value: "불량 개수",
                angle: -90,
                position: "insideLeft",
                fill: "#fff",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-800 p-3 border border-gray-700 rounded-lg shadow">
                      <p className="text-white font-medium">{`${payload[0].payload.displayName}`}</p>
                      <p className="text-white">{`불량 개수: ${payload[0].value}대`}</p>
                      {payload[0].payload.details && (
                        <p className="text-gray-300 text-sm mt-1">
                          {payload[0].payload.details}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              fill="#FFBB28"
              radius={[8, 8, 0, 0]} // Increased radius for more rounded bars
              name="불량 개수"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function processDataByDetailLevel(
  data: any[],
  detailLevel: "top" | "mid" | "full"
) {
  if (detailLevel === "top") {
    // Only show top-level categories (DR, FENDER, HD, etc.)
    const topLevelData: Record<string, { count: number; details: string[] }> =
      {};

    data.forEach((item) => {
      const parts = item.area.split("_");
      if (parts.length === 0) return;

      const topLevel = parts[0];

      if (!topLevelData[topLevel]) {
        topLevelData[topLevel] = { count: 0, details: [] };
      }

      topLevelData[topLevel].count += item.count;
      if (parts.length > 1) {
        topLevelData[topLevel].details.push(item.fullPath);
      }
    });

    return Object.entries(topLevelData)
      .map(([category, data]) => ({
        displayName: category,
        count: data.count,
        details: `${
          Array.from(new Set(data.details)).length
        }개 하위 카테고리 포함`,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }

  if (detailLevel === "mid") {
    // Show mid-level categories (DR_FRT, DR_RR, etc.)
    const midLevelData: Record<string, { count: number; details: string[] }> =
      {};

    data.forEach((item) => {
      const parts = item.area.split("_");
      if (parts.length < 2) return;

      const midLevel = `${parts[0]}_${parts[1]}`;

      if (!midLevelData[midLevel]) {
        midLevelData[midLevel] = { count: 0, details: [] };
      }

      midLevelData[midLevel].count += item.count;
      if (parts.length > 2) {
        midLevelData[midLevel].details.push(item.fullPath);
      }
    });

    return Object.entries(midLevelData)
      .map(([category, data]) => ({
        displayName: category,
        count: data.count,
        details: `${
          Array.from(new Set(data.details)).length
        }개 하위 카테고리 포함`,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }

  // Full detail - but limit to top 20 by count to prevent overcrowding
  return data
    .filter((item) => item.area.split("_").length >= 3) // Only include items with at least 3 levels
    .sort((a, b) => b.count - a.count) // Sort by count descending
    .slice(0, 20) // Take only top 20
    .map((item) => ({
      ...item,
      displayName: item.area,
      details: item.fullPath,
    }));
}
