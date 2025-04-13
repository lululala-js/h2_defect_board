import type {
  VehicleData,
  FilterCriteria,
  BoothData,
  TimeData,
  DefectAreaData,
} from "./types";
import { formatDate } from "./utils";

export function filterData(
  data: VehicleData[],
  filters: FilterCriteria
): VehicleData[] {
  return data.filter((item) => {
    // 날짜 필터
    if (filters.startDate && item.date < filters.startDate) {
      return false;
    }
    if (filters.endDate && item.date > filters.endDate) {
      return false;
    }

    // 차종 필터
    if (filters.vehicleType && item.vehicleType !== filters.vehicleType) {
      return false;
    }

    // 색상 필터
    if (filters.color && item.color !== filters.color) {
      return false;
    }

    // 재도장 ���부 필터
    if (
      filters.isRepainted !== null &&
      item.isRepainted !== filters.isRepainted
    ) {
      return false;
    }

    // 환입 여부 필터
    if (filters.isAccepted !== null && item.isAccepted !== filters.isAccepted) {
      return false;
    }

    return true;
  });
}

export function processBoothData(data: VehicleData[]): BoothData[] {
  const boothCounts: Record<string, number> = {};

  // 부스별 결함 수 집계
  data.forEach((item) => {
    const booth = item.booth || "Unknown";
    boothCounts[booth] = (boothCounts[booth] || 0) + 1;
  });

  // 차트용 배열 형식으로 변환
  return Object.entries(boothCounts)
    .map(([booth, count]) => ({
      booth,
      count,
    }))
    .sort((a, b) => a.booth.localeCompare(b.booth));
}

export function processTimeData(data: VehicleData[]): TimeData[] {
  // 날짜와 시간별로 그룹화
  const timeGroups: Record<string, Record<string, number>> = {};

  // 데이터를 날짜와 시간별로 정리
  data.forEach((item) => {
    const time = item.time || "Unknown";
    const date = item.date || "Unknown";

    if (!timeGroups[date]) {
      timeGroups[date] = {};
    }

    if (!timeGroups[date][time]) {
      timeGroups[date][time] = 0;
    }

    timeGroups[date][time] += 1;
  });

  // 차트용 배열 형식으로 변환
  const result: TimeData[] = [];

  Object.entries(timeGroups).forEach(([date, times]) => {
    Object.entries(times).forEach(([time, count]) => {
      result.push({
        time,
        date: formatDate(date), // MM/DD 형식으로 날짜 포맷
        fullDate: date,
        count,
      });
    });
  });

  // 날짜순, 시간순으로 정렬
  return result.sort((a, b) => {
    if (a.fullDate !== b.fullDate) {
      return a.fullDate.localeCompare(b.fullDate);
    }
    return a.time.localeCompare(b.time);
  });
}

export function processDefectAreaData(data: VehicleData[]): DefectAreaData[] {
  const defectAreaCounts: Record<string, { count: number; fullPath: string }> =
    {};

  // 결함 영역과 유형별로 집계
  data.forEach((item) => {
    if (!item.defectArea) return;

    // 결함 영역 계층 구조 파싱
    // 예: "DR_FRT_LH_DUST" -> ["DR", "FRT", "LH", "DUST"]
    const parts = item.defectArea.split("_");

    // 차트를 위한 다양한 계층 수준 생성
    for (let i = 1; i <= parts.length; i++) {
      const currentParts = parts.slice(0, i);
      const key = currentParts.join("_");
      const fullPath = currentParts.join(" > ");

      if (!defectAreaCounts[key]) {
        defectAreaCounts[key] = { count: 0, fullPath };
      }

      defectAreaCounts[key].count += 1;
    }
  });

  // 차트용 배열 형식으로 변환
  return Object.entries(defectAreaCounts)
    .map(([key, value], index) => ({
      id: `area-${index}`,
      area: key,
      count: value.count,
      fullPath: value.fullPath,
    }))
    .sort((a, b) => a.area.localeCompare(b.area));
}
