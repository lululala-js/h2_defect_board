import type { VehicleData, FilterCriteria, BoothData, TimeData, DefectAreaData } from "./types"
import { formatDate } from "./utils"

export function filterData(data: VehicleData[], filters: FilterCriteria): VehicleData[] {
  return data.filter((item) => {
    // Date filter
    if (filters.startDate && item.date < filters.startDate) {
      return false
    }
    if (filters.endDate && item.date > filters.endDate) {
      return false
    }

    // Vehicle type filter
    if (filters.vehicleType && !item.vehicleType.toLowerCase().includes(filters.vehicleType.toLowerCase())) {
      return false
    }

    // Color filter
    if (filters.color && !item.color.toLowerCase().includes(filters.color.toLowerCase())) {
      return false
    }

    // Repaint status filter (if exists in data)
    if (
      filters.repaintStatus &&
      item.repaintStatus &&
      !item.repaintStatus.toLowerCase().includes(filters.repaintStatus.toLowerCase())
    ) {
      return false
    }

    // Acceptance status filter (if exists in data)
    if (
      filters.acceptanceStatus &&
      item.acceptanceStatus &&
      !item.acceptanceStatus.toLowerCase().includes(filters.acceptanceStatus.toLowerCase())
    ) {
      return false
    }

    return true
  })
}

export function processBoothData(data: VehicleData[]): BoothData[] {
  const boothCounts: Record<string, number> = {}

  // Count defects by booth
  data.forEach((item) => {
    const booth = item.booth || "Unknown"
    boothCounts[booth] = (boothCounts[booth] || 0) + 1
  })

  // Convert to array format for chart
  return Object.entries(boothCounts)
    .map(([booth, count]) => ({
      booth,
      count,
    }))
    .sort((a, b) => a.booth.localeCompare(b.booth))
}

export function processTimeData(data: VehicleData[]): TimeData[] {
  // Group by date and time
  const timeGroups: Record<string, Record<string, number>> = {}

  // First, organize data by date and time
  data.forEach((item) => {
    const time = item.time || "Unknown"
    const date = item.date || "Unknown"

    if (!timeGroups[date]) {
      timeGroups[date] = {}
    }

    if (!timeGroups[date][time]) {
      timeGroups[date][time] = 0
    }

    timeGroups[date][time] += 1
  })

  // Convert to array format for chart
  const result: TimeData[] = []

  Object.entries(timeGroups).forEach(([date, times]) => {
    Object.entries(times).forEach(([time, count]) => {
      result.push({
        time,
        date: formatDate(date), // Format date as MM/DD
        fullDate: date,
        count,
      })
    })
  })

  // Sort by date and then by time
  return result.sort((a, b) => {
    if (a.fullDate !== b.fullDate) {
      return a.fullDate.localeCompare(b.fullDate)
    }
    return a.time.localeCompare(b.time)
  })
}

export function processDefectAreaData(data: VehicleData[]): DefectAreaData[] {
  const defectAreaCounts: Record<string, { count: number; fullPath: string }> = {}

  // Count defects by area and type
  data.forEach((item) => {
    if (!item.defectArea) return

    // Parse the hierarchical structure from the defect area
    // Example: "DR_FRT_LH_DUST" -> ["DR", "FRT", "LH", "DUST"]
    const parts = item.defectArea.split("_")

    // Create different levels of hierarchy for the chart
    for (let i = 1; i <= parts.length; i++) {
      const currentParts = parts.slice(0, i)
      const key = currentParts.join("_")
      const displayKey = currentParts.join("_")
      const fullPath = currentParts.join(" > ")

      if (!defectAreaCounts[key]) {
        defectAreaCounts[key] = { count: 0, fullPath }
      }

      defectAreaCounts[key].count += 1
    }
  })

  // Convert to array format for chart
  return Object.entries(defectAreaCounts)
    .map(([key, value], index) => ({
      id: `area-${index}`,
      area: key,
      count: value.count,
      fullPath: value.fullPath,
    }))
    .sort((a, b) => a.area.localeCompare(b.area))
}

