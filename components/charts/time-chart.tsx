"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"

interface TimeChartProps {
  data: {
    time: string
    count: number
    date: string
    fullDate: string
  }[]
}

export default function TimeChart({ data }: TimeChartProps) {
  const [viewMode, setViewMode] = useState<"hourly" | "daily" | "weekly">("hourly")

  // Group data by different time intervals based on view mode
  const processedData = processDataByViewMode(data, viewMode)

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 mb-4">
        <Button
          onClick={() => setViewMode("hourly")}
          variant={viewMode === "hourly" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
        >
          시간별
        </Button>
        <Button
          onClick={() => setViewMode("daily")}
          variant={viewMode === "daily" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
        >
          일별
        </Button>
        <Button
          onClick={() => setViewMode("weekly")}
          variant={viewMode === "weekly" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
        >
          주별
        </Button>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{
                fill: "#fff",
                angle: viewMode === "hourly" ? 0 : -45,
                textAnchor: viewMode === "hourly" ? "middle" : "end",
                fontSize: 12,
                dy: viewMode === "hourly" ? 0 : 10,
              }}
              axisLine={{ stroke: "#777" }}
              tickLine={{ stroke: "#777" }}
              height={viewMode === "hourly" ? 30 : 60}
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
                      <p className="text-white font-medium">{`${payload[0].payload.label}`}</p>
                      <p className="text-white">{`불량 개수: ${payload[0].value}대`}</p>
                      {payload[0].payload.details && (
                        <p className="text-gray-300 text-sm mt-1">{payload[0].payload.details}</p>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey="count"
              fill="#00C49F"
              radius={[8, 8, 0, 0]} // Increased radius for more rounded bars
              name="불량 개수"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function processDataByViewMode(data: any[], viewMode: "hourly" | "daily" | "weekly") {
  if (viewMode === "hourly") {
    // Group by hour only (ignoring date)
    const hourlyData: Record<string, { count: number; dates: Set<string> }> = {}

    data.forEach((item) => {
      const hour = item.time.split(":")[0]
      const hourKey = `${hour}:00`

      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = { count: 0, dates: new Set() }
      }

      hourlyData[hourKey].count += item.count
      hourlyData[hourKey].dates.add(item.date)
    })

    return Object.entries(hourlyData)
      .map(([hour, data]) => ({
        label: hour,
        count: data.count,
        details: `${data.dates.size}일 동안의 합계`,
      }))
      .sort((a, b) => {
        const hourA = Number.parseInt(a.label.split(":")[0])
        const hourB = Number.parseInt(b.label.split(":")[0])
        return hourA - hourB
      })
  }

  if (viewMode === "daily") {
    // Group by date
    const dailyData: Record<string, number> = {}

    data.forEach((item) => {
      if (!dailyData[item.date]) {
        dailyData[item.date] = 0
      }

      dailyData[item.date] += item.count
    })

    return Object.entries(dailyData)
      .map(([date, count]) => ({
        label: date,
        count,
        details: `전체 시간대 합계`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  if (viewMode === "weekly") {
    // Group by week
    const weeklyData: Record<string, number> = {}

    data.forEach((item) => {
      const date = new Date(item.fullDate)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6) // End of week (Saturday)

      const weekKey = `${formatDateShort(weekStart)} ~ ${formatDateShort(weekEnd)}`

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = 0
      }

      weeklyData[weekKey] += item.count
    })

    return Object.entries(weeklyData)
      .map(([week, count]) => ({
        label: week,
        count,
        details: `주간 합계`,
      }))
      .sort((a, b) => {
        // Extract the start date from the week range for sorting
        const dateA = a.label.split(" ~ ")[0]
        const dateB = b.label.split(" ~ ")[0]
        return dateA.localeCompare(dateB)
      })
  }

  return []
}

function formatDateShort(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

