"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BoothChartProps {
  data: {
    booth: string
    count: number
  }[]
}

export default function BoothChart({ data }: BoothChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" vertical={false} />
          <XAxis dataKey="booth" tick={{ fill: "#fff" }} axisLine={{ stroke: "#777" }} tickLine={{ stroke: "#777" }} />
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
                  <div className="bg-gray-800 p-2 border border-gray-700 rounded-lg shadow">
                    <p className="text-white">{`${payload[0].payload.booth}: ${payload[0].value}대`}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="count"
            fill="#0088FE"
            radius={[8, 8, 0, 0]} // Increased radius for more rounded bars
            name="불량 개수"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

